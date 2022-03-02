import { Color, OrthographicCamera, PlaneGeometry, Scene, Uniform, Vector2, WebGLRenderer } from 'three';

import { Config } from '../../config/Config.js';

import { getFullscreenTriangle } from '../../utils/world/Utils3D.js';

export class WorldController {
    static init() {
        this.initWorld();
    }

    static initWorld() {
        this.renderer = new WebGLRenderer({
            powerPreference: 'high-performance',
            stencil: false
        });
        this.element = this.renderer.domElement;

        // 2D scene
        this.scene = new Scene();
        this.scene.background = new Color(Config.BG_COLOR);
        this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

        // Global geometries
        this.quad = new PlaneGeometry(1, 1);
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
        this.camera.left = -width / 2;
        this.camera.right = width / 2;
        this.camera.top = height / 2;
        this.camera.bottom = -height / 2;
        this.camera.updateProjectionMatrix();
        this.camera.position.x = width / 2;
        this.camera.position.y = -height / 2;

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
