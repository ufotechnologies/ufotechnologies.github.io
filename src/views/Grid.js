import { Group, LinearFilter, Mesh, Texture } from 'three';

import { WorldController } from '../controllers/world/WorldController.js';
import { BasicMaterial } from '../materials/BasicMaterial.js';
import { GridCanvas } from './GridCanvas.js';

export class Grid extends Group {
    constructor() {
        super();

        this.visible = false;

        this.initTexture();
        this.initMesh();
    }

    initTexture() {
        this.grid = new GridCanvas();

        this.texture = new Texture(this.grid.element);
        this.texture.minFilter = LinearFilter;
        this.texture.generateMipmaps = false;
    }

    initMesh() {
        const { quad } = WorldController;

        this.material = new BasicMaterial(this.texture);

        this.mesh = new Mesh(quad, this.material);
        this.mesh.frustumCulled = false;

        this.add(this.mesh);
    }

    /**
     * Public methods
     */

    resize = (width, height, dpr) => {
        this.mesh.scale.set(width, height, 1);
        this.grid.resize(width, height, dpr);

        this.texture.needsUpdate = true;
    };

    update = () => {
        if (!this.visible) {
            return;
        }
    };

    animateIn = () => {
        this.visible = true;
    };
}
