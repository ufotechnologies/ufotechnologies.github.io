uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;
uniform float distortion;

varying vec2 vUv;

#pragma glslify: getRGB = require('./modules/rgbshift/rgbshift')

void main() {
    //float angle = 3.14159;
    //float angle = time * 0.1;
    float angle = length(vUv - vec2(0.5));
    //float amount = 0.3;
    //float amount = cos(time) * 0.02;
    //float amount = (0.002 * cos(time)) + 0.0002;
    float amount = (distortion * cos(time)) + 0.0002;
    gl_FragColor = getRGB(texture, vUv, angle, amount);
}
