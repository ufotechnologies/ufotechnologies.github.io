/* global THREE */

import { Component, Shader, Stage } from '../../alien.js/src/Alien.js';

import { World } from '../controllers/World.js';
import { CanvasGridTexture } from './CanvasGridTexture.js';

import vertBasicShader from '../shaders/basic_shader.vert';
import fragBasicShader from '../shaders/basic_shader.frag';

export class CanvasGrid extends Component {
    constructor() {
        super();
        const self = this;
        let grid, shader, mesh;

        this.group = new THREE.Group();
        this.group.visible = false;
        World.scene.add(this.group);

        initCanvasTexture();
        initMesh();

        function initCanvasTexture() {
            grid = self.initClass(CanvasGridTexture);
        }

        function initMesh() {
            shader = self.initClass(Shader, vertBasicShader, fragBasicShader, {
                tMap: { value: grid.texture },
                uAlpha: { value: 1 },
                uTime: World.time,
                uResolution: World.resolution,
                depthWrite: false,
                depthTest: false
            });
            mesh = new THREE.Mesh(World.quad, shader.material);
            mesh.frustumCulled = false;
            self.group.add(mesh);
        }

        function loop() {
            if (!self.group.visible) return;
            if (grid.needsUpdate || grid.alienkitty.needsUpdate) {
                grid.canvas.render();
                grid.texture.needsUpdate = true;
            }
        }

        this.resize = () => {
            grid.update();
            mesh.scale.set(Stage.width, Stage.height, 1);
        };

        this.showAlienKitty = grid.showAlienKitty;

        this.hideAlienKitty = grid.hideAlienKitty;

        this.animateIn = () => {
            grid.update();
            grid.animateIn();
            grid.canvas.render();
            grid.texture.needsUpdate = true;
            this.startRender(loop);
            this.group.visible = true;
        };

        this.ready = grid.ready;
    }
}
