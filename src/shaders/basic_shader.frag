uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform float uAlpha;

varying vec2 vUv;

void main() {
    vec4 color = texture2D(uTexture, vUv);
    color.a *= uAlpha;
    gl_FragColor = color;
}
