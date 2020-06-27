import { RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/BasicMaterial.vert.js';
import fragmentShader from '../shaders/BasicMaterial.frag.js';

export class BasicMaterial extends RawShaderMaterial {
    constructor(texture) {
        super({
            type: 'BasicMaterial',
            uniforms: {
                tMap: new Uniform(texture),
                uAlpha: new Uniform(1.0)
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false,
            depthTest: false
        });
    }
}
