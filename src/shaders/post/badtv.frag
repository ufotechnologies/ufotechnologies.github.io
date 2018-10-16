uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;
uniform float distortion;
uniform float distortion2;

varying vec2 vUv;

#pragma glslify: getBadTV = require('./modules/badtv/badtv')

void main() {
    gl_FragColor = getBadTV(texture, vUv, time, distortion, distortion2);
}
