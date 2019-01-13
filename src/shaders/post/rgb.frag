uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D tDiffuse;
uniform float uDistortion;

varying vec2 vUv;

#pragma glslify: getRGB = require('./modules/rgbshift/rgbshift')

void main() {
    //float angle = 3.14159;
    //float angle = uTime * 0.1;
    float angle = length(vUv - vec2(0.5));
    //float amount = 0.3;
    //float amount = cos(uTime) * 0.02;
    //float amount = (0.002 * cos(uTime)) + 0.0002;
    float amount = (uDistortion * cos(uTime)) + 0.0002;
    gl_FragColor = getRGB(tDiffuse, vUv, angle, amount);
}
