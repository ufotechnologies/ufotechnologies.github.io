import { NoBlending, RawShaderMaterial, Uniform } from 'three';

import { WorldController } from '../controllers/world/WorldController.js';

import vertexShader from '../shaders/RGBPass.vert.js';
import fragmentShader from '../shaders/RGBPass.frag.js';

export class RGBMaterial extends RawShaderMaterial {
    constructor() {
        super({
            type: 'RGBMaterial',
            uniforms: {
                tMap: new Uniform(null),
                uDistortion: new Uniform(0.0),
                uTime: WorldController.time
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
