import { Group, LinearFilter, Mesh, Texture } from 'three';

import { WorldController } from '../controllers/world/WorldController.js';
import { BasicMaterial } from '../materials/BasicMaterial.js';
import { AlienKittyCanvas } from './AlienKittyCanvas.js';

import { clearTween, tween } from '../tween/Tween.js';

export class AlienKitty extends Group {
    constructor() {
        super();

        this.visible = false;

        this.width = 90;
        this.height = 86;

        this.initTexture();
        this.initMesh();
    }

    initTexture() {
        this.alienkitty = new AlienKittyCanvas();

        this.texture = new Texture(this.alienkitty.element);
        this.texture.minFilter = LinearFilter;
        this.texture.generateMipmaps = false;
    }

    initMesh() {
        const { quad } = WorldController;

        this.material = new BasicMaterial(this.texture);

        this.mesh = new Mesh(quad, this.material);
        this.mesh.frustumCulled = false;
        this.mesh.scale.set(this.width, this.height, 1);

        this.add(this.mesh);
    }

    /**
     * Public methods
     */

    resize = (width, height, dpr) => {
        this.position.x = Math.round((width - this.width) / 2);
        this.position.y = -(Math.round((height - this.height) / 2) - 65);

        this.alienkitty.resize(width, height, dpr);

        this.texture.needsUpdate = true;
    };

    update = () => {
        if (!this.visible) {
            return;
        }

        if (this.alienkitty.needsUpdate) {
            this.texture.needsUpdate = true;
        }
    };

    showAlienKitty = time => {
        clearTween(this.material.uniforms.uAlpha);
        tween(this.material.uniforms.uAlpha, { value: 1 }, time, 'easeInOutExpo');
    };

    hideAlienKitty = () => {
        clearTween(this.material.uniforms.uAlpha);
        tween(this.material.uniforms.uAlpha, { value: 0 }, 250, 'easeOutSine');
    };

    animateIn = () => {
        this.alienkitty.animateIn();
        this.visible = true;
    };

    ready = () => this.alienkitty.ready();
}
