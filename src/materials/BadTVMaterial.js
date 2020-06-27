import { NoBlending, RawShaderMaterial, Uniform } from 'three';

import { WorldController } from '../controllers/world/WorldController.js';

import vertexShader from '../shaders/BadTVPass.vert.js';
import fragmentShader from '../shaders/BadTVPass.frag.js';

export class BadTVMaterial extends RawShaderMaterial {
    constructor() {
        super({
            type: 'BadTVMaterial',
            uniforms: {
                tMap: new Uniform(null),
                uDistortion: new Uniform(0.0),
                uDistortion2: new Uniform(0.0),
                uRollSpeed: new Uniform(0.0),
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
