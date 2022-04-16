import { Mesh, OrthographicCamera, Scene, WebGLRenderTarget } from 'three';

import { Events } from '../../config/Events.js';
import { WorldController } from './WorldController.js';
import { Stage } from '../../utils/Stage.js';
import { BadTVMaterial } from '../../materials/BadTVMaterial.js';
import { RGBMaterial } from '../../materials/RGBMaterial.js';

import { clearTween, delayedCall, tween } from '../../tween/Tween.js';
import { mapLinear } from '../../utils/Utils.js';

export class RenderManager {
    static init(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;

        this.timeout;
        this.multiplier = 1;
        this.enabled = true;

        this.initRenderer();

        this.addListeners();
    }

    static initRenderer() {
        const { screenTriangle, time } = WorldController;

        // Fullscreen triangle
        this.screenScene = new Scene();
        this.screenCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

        this.screen = new Mesh(screenTriangle);
        this.screen.frustumCulled = false;
        this.screenScene.add(this.screen);

        // Render targets
        this.renderTargetA = new WebGLRenderTarget(1, 1, {
            stencilBuffer: false,
            depthBuffer: false
        });
        this.renderTargetA.texture.generateMipmaps = false;
        this.renderTargetB = this.renderTargetA.clone();

        // Bad TV material
        this.badtv = new BadTVMaterial();
        this.badtv.uniforms.uTime = time;

        // RGB material
        this.rgb = new RGBMaterial();
        this.rgb.uniforms.uTime = time;
    }

    static addListeners() {
        Stage.events.on(Events.GLITCH_IN, this.onGlitchIn);
        Stage.events.on(Events.GLITCH_OUT, this.onGlitchOut);
        Stage.events.on(Events.GLITCH_LOADER, this.onGlitchLoader);
    }

    /**
     * Event handlers
     */

    static onGlitchIn = ({ delta }) => {
        const time = mapLinear(delta, 0, 400, 300, 50);

        clearTween(this.badtv.uniforms.uDistortion);
        clearTween(this.badtv.uniforms.uDistortion2);
        clearTween(this.rgb.uniforms.uDistortion);
        clearTween(this.timeout);

        this.enabled = true;

        tween(this.badtv.uniforms.uDistortion, { value: mapLinear(delta, 0, 400, 0, 8) * this.multiplier }, time, 'easeInOutExpo');
        tween(this.badtv.uniforms.uDistortion2, { value: mapLinear(delta, 0, 400, 0, 2) * this.multiplier }, time, 'easeInOutExpo');
        tween(this.rgb.uniforms.uDistortion, { value: mapLinear(delta, 0, 400, 0, 0.02) * this.multiplier }, time, 'easeInOutExpo');

        this.timeout = delayedCall(time, () => {
            tween(this.badtv.uniforms.uDistortion, { value: 1 * this.multiplier }, 300, 'easeInOutExpo');
            tween(this.badtv.uniforms.uDistortion2, { value: 1 * this.multiplier }, 300, 'easeInOutExpo');
            tween(this.rgb.uniforms.uDistortion, { value: 0.002 * this.multiplier }, 300, 'easeInOutExpo');
        });
    };

    static onGlitchOut = () => {
        clearTween(this.badtv.uniforms.uDistortion);
        clearTween(this.badtv.uniforms.uDistortion2);
        clearTween(this.rgb.uniforms.uDistortion);
        clearTween(this.timeout);

        tween(this.badtv.uniforms.uDistortion, { value: 0 }, 300, 'easeOutSine');
        tween(this.badtv.uniforms.uDistortion2, { value: 0 }, 300, 'easeOutSine');
        tween(this.rgb.uniforms.uDistortion, { value: 0 }, 300, 'easeOutSine');

        this.timeout = delayedCall(500, () => {
            this.enabled = false;
        });
    };

    static onGlitchLoader = () => {
        tween(this.badtv.uniforms.uDistortion, { value: 4 * this.multiplier }, 300, 'easeInOutExpo');
        tween(this.badtv.uniforms.uDistortion2, { value: 1 * this.multiplier }, 300, 'easeInOutExpo');
        tween(this.rgb.uniforms.uDistortion, { value: 0.01 * this.multiplier }, 300, 'easeInOutExpo');

        this.timeout = delayedCall(500, () => {
            Stage.events.emit(Events.GLITCH_OUT);
        });
    };

    /**
     * Public methods
     */

    static resize = (width, height, dpr) => {
        this.renderer.setPixelRatio(dpr);
        this.renderer.setSize(width, height);

        width = Math.round(width * dpr);
        height = Math.round(height * dpr);

        this.renderTargetA.setSize(width, height);
        this.renderTargetB.setSize(width, height);

        if (width < height) {
            this.multiplier = 2;
        } else {
            this.multiplier = 1;
        }
    };

    static update = () => {
        const renderer = this.renderer;
        const scene = this.scene;
        const camera = this.camera;

        if (!this.enabled) {
            renderer.setRenderTarget(null);
            renderer.render(scene, camera);
            return;
        }

        const screenScene = this.screenScene;
        const screenCamera = this.screenCamera;

        const renderTargetA = this.renderTargetA;
        const renderTargetB = this.renderTargetB;

        // Scene pass
        renderer.setRenderTarget(renderTargetA);
        renderer.render(scene, camera);

        // Bad TV pass
        this.badtv.uniforms.tMap.value = renderTargetA.texture;
        this.screen.material = this.badtv;
        renderer.setRenderTarget(renderTargetB);
        renderer.render(screenScene, screenCamera);

        // RGB pass (render to screen)
        this.rgb.uniforms.tMap.value = renderTargetB.texture;
        this.screen.material = this.rgb;
        renderer.setRenderTarget(null);
        renderer.render(screenScene, screenCamera);
    };
}
