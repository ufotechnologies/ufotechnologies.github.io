import { Mesh, OrthographicCamera, Scene, Vector2, WebGLRenderTarget } from 'three';

import { Events } from '../../config/Events.js';
import { WorldController } from './WorldController.js';
import { Flowmap } from '../../utils/world/Flowmap.js';
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

        this.mouse = new Vector2(-1, -1);
        this.velocity = new Vector2();
        this.lastTime = null;
        this.lastMouse = new Vector2();
        this.multiplier = 1;
        this.enabled = true;

        this.initRenderer();

        this.addListeners();
    }

    static initRenderer() {
        const { screenTriangle, aspect, time } = WorldController;

        // Fullscreen triangle
        this.screenScene = new Scene();
        this.screenCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

        this.screen = new Mesh(screenTriangle);
        this.screen.frustumCulled = false;
        this.screenScene.add(this.screen);

        // Render targets
        this.renderTargetA = new WebGLRenderTarget(1, 1, {
            depthBuffer: false
        });
        this.renderTargetA.texture.generateMipmaps = false;
        this.renderTargetB = this.renderTargetA.clone();

        // Flowmap
        this.flowmap = new Flowmap(this.renderer, {
            falloff: 0.098,
            alpha: 0.25,
            dissipation: 0.8
        });
        this.flowmap.material.uniforms.uAspect = aspect;

        // Bad TV material
        this.badtv = new BadTVMaterial();
        this.badtv.uniforms.uTime = time;

        // RGB material
        this.rgb = new RGBMaterial();
        this.rgb.uniforms.tFlow = this.flowmap.uniform;
        this.rgb.uniforms.uTime = time;
    }

    static addListeners() {
        Stage.events.on(Events.GLITCH_IN, this.onGlitchIn);
        Stage.events.on(Events.GLITCH_OUT, this.onGlitchOut);
        Stage.events.on(Events.GLITCH_LOADER, this.onGlitchLoader);
        window.addEventListener('pointerdown', this.onPointerDown);
        window.addEventListener('pointermove', this.onPointerMove);
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

        // this.enabled = true;

        tween(this.badtv.uniforms.uDistortion, { value: mapLinear(delta, 0, 400, 0, 8) * this.multiplier }, time, 'easeInOutExpo');
        tween(this.badtv.uniforms.uDistortion2, { value: mapLinear(delta, 0, 400, 0, 2) * this.multiplier }, time, 'easeInOutExpo');
        tween(this.rgb.uniforms.uDistortion, { value: mapLinear(delta, 0, 400, 0, 0.02) * this.multiplier }, time, 'easeInOutExpo');

        this.timeout = delayedCall(time, () => {
            tween(this.badtv.uniforms.uDistortion, { value: 0.5 * this.multiplier }, 300, 'easeOutSine');
            tween(this.badtv.uniforms.uDistortion2, { value: 0.25 * this.multiplier }, 300, 'easeOutSine');
            tween(this.rgb.uniforms.uDistortion, { value: 0.002 * this.multiplier }, 300, 'easeOutSine');
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

        // this.timeout = delayedCall(500, () => {
        //     this.enabled = false;
        // });
    };

    static onGlitchLoader = () => {
        tween(this.badtv.uniforms.uDistortion, { value: 4 * this.multiplier }, 300, 'easeInOutExpo');
        tween(this.badtv.uniforms.uDistortion2, { value: 1 * this.multiplier }, 300, 'easeInOutExpo');
        tween(this.rgb.uniforms.uDistortion, { value: 0.01 * this.multiplier }, 300, 'easeInOutExpo');

        this.timeout = delayedCall(500, () => {
            Stage.events.emit(Events.GLITCH_OUT);
        });
    };

    static onPointerDown = e => {
        this.onPointerMove(e);
    };

    static onPointerMove = ({ clientX, clientY }) => {
        const event = {
            x: clientX,
            y: clientY
        };

        // Get mouse value in 0 to 1 range, with Y flipped
        this.mouse.set(
            event.x / this.width,
            1 - event.y / this.height
        );

        // Calculate velocity
        if (!this.lastTime) {
            this.lastTime = performance.now();
            this.lastMouse.set(event.x, event.y);
        }

        const deltaX = event.x - this.lastMouse.x;
        const deltaY = event.y - this.lastMouse.y;

        this.lastMouse.set(event.x, event.y);

        const time = performance.now();

        // Avoid dividing by 0
        const delta = Math.max(14, time - this.lastTime);
        this.lastTime = time;

        this.velocity.x = deltaX / delta;
        this.velocity.y = deltaY / delta;

        // Flag update to prevent hanging velocity values when not moving
        this.velocity.needsUpdate = true;
    };

    /**
     * Public methods
     */

    static resize = (width, height, dpr) => {
        this.width = width;
        this.height = height;

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

        // Reset velocity when mouse not moving
        if (!this.velocity.needsUpdate) {
            this.mouse.set(-1, -1);
            this.velocity.set(0, 0);
            this.lastTime = null;
        }
        this.velocity.needsUpdate = false;

        // Update flowmap inputs
        this.flowmap.mouse.copy(this.mouse);

        // Ease velocity input, slower when fading out
        this.flowmap.velocity.lerp(this.velocity, this.velocity.length() ? 0.5 : 0.1);
        this.flowmap.update();

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
