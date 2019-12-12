/* global THREE */

import { Component, Device, Effects, Events, Interface, Shader, Stage } from '../../alien.js/src/Alien.js';

import vertBasicPass from '../shaders/basic_pass.vert';
//import fragBasicPass from '../shaders/basic_pass.frag';
import fragBadTV from '../shaders/post/badtv.frag';
import fragRGB from '../shaders/post/rgb.frag';

export class World extends Component {
    static instance() {
        if (!this.singleton) this.singleton = new World();
        return this.singleton;
    }

    constructor() {
        super();
        const self = this;
        const multiplier = Device.mobile ? 2 : 1;
        let renderer, scene, camera, effects, badtv, rgb, timeout;

        World.dpr = Math.min(2, Device.pixelRatio);

        initWorld();
        addListeners();
        this.startRender(loop);

        function initWorld() {
            renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance', precision: 'mediump' });
            renderer.setPixelRatio(World.dpr);
            scene = new THREE.Scene();
            camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            World.scene = scene;
            World.renderer = renderer;
            World.element = renderer.domElement;
            World.object = new Interface(World.element);
            World.camera = camera;
            World.quad = new THREE.PlaneBufferGeometry(1, 1);
            World.time = { value: 0 };
            World.resolution = { value: new THREE.Vector2() };
            effects = self.initClass(Effects, Stage, {
                renderer,
                scene,
                camera,
                dpr: World.dpr
            });
            badtv = self.initClass(Shader, vertBasicPass, fragBadTV, {
                tDiffuse: { value: null },
                uDistortion: { value: 0 },
                uDistortion2: { value: 0 },
                uRollSpeed: { value: 0 },
                uTime: World.time,
                depthWrite: false,
                depthTest: false
            });
            rgb = self.initClass(Shader, vertBasicPass, fragRGB, {
                tDiffuse: { value: null },
                uDistortion: { value: 0 },
                uTime: World.time,
                depthWrite: false,
                depthTest: false
            });
            effects.add(badtv);
            effects.add(rgb);
            World.effects = effects;
            World.object.css({ position: 'fixed' }).mouseEnabled(false);
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            self.events.add(Events.GLITCH_IN, glitchIn);
            self.events.add(Events.GLITCH_OUT, glitchOut);
            self.events.add(Events.GLITCH_LOADER, glitchLoader);
            resize();
        }

        function resize() {
            renderer.setSize(Stage.width, Stage.height);
            effects.setSize(Stage.width, Stage.height);
            camera.left = -Stage.width / 2;
            camera.right = Stage.width / 2;
            camera.top = Stage.height / 2;
            camera.bottom = -Stage.height / 2;
            camera.updateProjectionMatrix();
            World.resolution.value.set(Stage.width * World.dpr, Stage.height * World.dpr);
        }

        function glitchIn(delta = 0) {
            const time = Math.range(delta, 0, 400, 300, 50);
            self.clearTimeout(timeout);
            effects.enabled = true;
            tween(badtv.uniforms.uDistortion, { value: Math.range(delta, 0, 400, 0, 8) * multiplier }, time, 'easeInOutExpo');
            tween(badtv.uniforms.uDistortion2, { value: Math.range(delta, 0, 400, 0, 2) * multiplier }, time, 'easeInOutExpo');
            tween(rgb.uniforms.uDistortion, { value: Math.range(delta, 0, 400, 0, 0.02) * multiplier }, time, 'easeInOutExpo');
            timeout = self.delayedCall(() => {
                tween(badtv.uniforms.uDistortion, { value: 1 * multiplier }, 300, 'easeInOutExpo');
                tween(badtv.uniforms.uDistortion2, { value: 1 * multiplier }, 300, 'easeInOutExpo');
                tween(rgb.uniforms.uDistortion, { value: 0.002 * multiplier }, 300, 'easeInOutExpo');
            }, time);
        }

        function glitchOut() {
            self.clearTimeout(timeout);
            tween(badtv.uniforms.uDistortion, { value: 0 }, 300, 'easeOutSine');
            tween(badtv.uniforms.uDistortion2, { value: 0 }, 300, 'easeOutSine');
            tween(rgb.uniforms.uDistortion, { value: 0 }, 300, 'easeOutSine');
            timeout = self.delayedCall(() => effects.enabled = false, 500);
        }

        function glitchLoader() {
            tween(badtv.uniforms.uDistortion, { value: 4 * multiplier }, 300, 'easeInOutExpo');
            tween(badtv.uniforms.uDistortion2, { value: 1 * multiplier }, 300, 'easeInOutExpo');
            tween(rgb.uniforms.uDistortion, { value: 0.01 * multiplier }, 300, 'easeInOutExpo');
            timeout = self.delayedCall(() => self.events.fire(Events.GLITCH_OUT), 500);
        }

        function loop(t, dt) {
            World.time.value += dt * 0.001;
            effects.render();
        }
    }
}
