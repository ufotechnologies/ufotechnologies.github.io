import badtv from 'alien.js/src/shaders/modules/badtv/badtv.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform float uDistortion;
uniform float uDistortion2;
uniform float uRollSpeed;
uniform float uTime;

varying vec2 vUv;

${badtv}

void main() {
    gl_FragColor = getBadTV(tMap, vUv, uTime, uDistortion, uDistortion2, uRollSpeed);
}
`;
