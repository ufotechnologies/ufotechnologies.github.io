uniform sampler2D tMap;
uniform float uAlpha;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
    vec4 color = texture2D(tMap, vUv);
    color.a *= uAlpha;
    gl_FragColor = color;
}
