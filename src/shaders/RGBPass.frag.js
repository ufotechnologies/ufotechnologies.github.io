import rgbshift from 'alien.js/src/shaders/modules/rgbshift/rgbshift.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uDistortion;
uniform float uTime;

varying vec2 vUv;

${rgbshift}

void main() {
    // float angle = 3.14159;
    // float angle = uTime * 0.1;
    float angle = length(vUv - vec2(0.5));
    // float amount = 0.3;
    // float amount = cos(uTime) * 0.02;
    // float amount = (0.002 * cos(uTime)) + 0.0002;
    float amount = (uDistortion * cos(uTime)) + 0.0002;
    gl_FragColor = getRGB(tMap, vUv, angle, amount);
}
`;
