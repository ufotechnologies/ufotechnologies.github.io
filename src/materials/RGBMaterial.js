import { GLSL3, NoBlending, RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/RGBPass.vert.js';
import fragmentShader from '../shaders/RGBPass.frag.js';

export class RGBMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: new Uniform(null),
                tFlow: new Uniform(null),
                uDistortion: new Uniform(0),
                uTime: new Uniform(0)
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
