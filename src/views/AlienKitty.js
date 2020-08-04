import { Group, LinearFilter, Mesh, Texture } from 'three';

import { clearTween, tween } from 'alien.js';

import { WorldController } from '../controllers/world/WorldController.js';
import { AlienKittyCanvas } from './AlienKittyCanvas.js';
import { BasicMaterial } from '../materials/BasicMaterial.js';

export class AlienKitty extends Group {
    constructor() {
        super();

        this.width = 90;
        this.height = 86;
        this.visible = false;

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
        this.material = new BasicMaterial(this.texture);

        this.mesh = new Mesh(WorldController.quad, this.material);
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
