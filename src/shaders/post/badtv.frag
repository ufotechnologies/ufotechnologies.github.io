uniform sampler2D tDiffuse;
uniform float uDistortion;
uniform float uDistortion2;
uniform float uTime;

varying vec2 vUv;

#pragma glslify: getBadTV = require('./modules/badtv/badtv')

void main() {
    gl_FragColor = getBadTV(tDiffuse, vUv, uTime, uDistortion, uDistortion2);
}
