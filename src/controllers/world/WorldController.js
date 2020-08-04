import {
    Color,
    OrthographicCamera,
    PlaneBufferGeometry,
    Scene,
    Uniform,
    Vector2,
    WebGLRenderer
} from 'three';

import { getFullscreenTriangle } from 'alien.js';

import { Config } from '../../config/Config.js';

export class WorldController {
    static init() {
        this.initWorld();
    }

    static initWorld() {
        this.renderer = new WebGLRenderer({ powerPreference: 'high-performance' });
        this.element = this.renderer.domElement;

        // 2D scene
        this.scene = new Scene();
        this.scene.background = new Color(Config.BG_COLOR);
        this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

        // Global geometries
        this.quad = new PlaneBufferGeometry(1, 1);
        this.quad.translate(0.5, -0.5, 0);
        this.screenTriangle = getFullscreenTriangle();

        // Global uniforms
        this.resolution = new Uniform(new Vector2());
        this.aspect = new Uniform(1);
        this.time = new Uniform(0);
        this.frame = new Uniform(0);
    }

    /**
     * Public methods
     */

    static resize = (width, height, dpr) => {
        const camera = this.camera;

        // 2D scene
        camera.left = -width / 2;
        camera.right = width / 2;
        camera.top = height / 2;
        camera.bottom = -height / 2;
        camera.updateProjectionMatrix();
        camera.position.x = width / 2;
        camera.position.y = -height / 2;

        width = Math.round(width * dpr);
        height = Math.round(height * dpr);

        this.resolution.value.set(width, height);
        this.aspect.value = width / height;
    };

    static update = (time, delta, frame) => {
        this.time.value = time;
        this.frame.value = frame;
    };
}
