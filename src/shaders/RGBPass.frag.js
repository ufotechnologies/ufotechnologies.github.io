import rgbshift from './modules/rgbshift/rgbshift.glsl.js';
import blendAdd from './modules/blending/add.glsl.js';
import blendAlpha from './modules/blending/alpha.glsl.js';
import blendAverage from './modules/blending/average.glsl.js';
import blendColorBurn from './modules/blending/color-burn.glsl.js';
import blendColorDodge from './modules/blending/color-dodge.glsl.js';
import blendDarken from './modules/blending/darken.glsl.js';
import blendDifference from './modules/blending/difference.glsl.js';
import blendDivide from './modules/blending/divide.glsl.js';
import blendExclusion from './modules/blending/exclusion.glsl.js';
import blendLighten from './modules/blending/lighten.glsl.js';
import blendMultiply from './modules/blending/multiply.glsl.js';
import blendNegation from './modules/blending/negation.glsl.js';
import blendNormal from './modules/blending/normal.glsl.js';
import blendOverlay from './modules/blending/overlay.glsl.js';
import blendReflect from './modules/blending/reflect.glsl.js';
import blendScreen from './modules/blending/screen.glsl.js';
import blendSoftLight from './modules/blending/soft-light.glsl.js';
import blendSubtract from './modules/blending/subtract.glsl.js';

export default /* glsl */`
precision highp float;

uniform sampler2D tMap;
uniform sampler2D tFlow;
uniform float uDistortion;
uniform float uTime;

in vec2 vUv;

out vec4 FragColor;

${rgbshift}
${blendAdd}
${blendAlpha}
${blendAverage}
${blendColorBurn}
${blendColorDodge}
${blendDarken}
${blendDifference}
${blendDivide}
${blendExclusion}
${blendLighten}
${blendMultiply}
${blendNegation}
${blendNormal}
${blendOverlay}
${blendReflect}
${blendScreen}
${blendSoftLight}
${blendSubtract}

void main() {
    // R and G values are velocity in the X and Y direction
    // B value is the velocity length
    vec4 flow = texture(tFlow, vUv);

    // Use flow to adjust the UV lookup of a texture
    vec2 uv = vUv;
    uv += flow.rg * -0.05;

    // float angle = 3.14159;
    // float angle = uTime * 0.1;
    float angle = length(uv - vec2(0.5));
    // float amount = 0.3;
    // float amount = cos(uTime) * 0.02;
    // float amount = (0.002 * cos(uTime)) + 0.0002;
    float amount = (uDistortion * cos(uTime)) + 0.0002;
    amount += length(flow.rg) * 0.025;

    vec4 base = getRGB(tMap, uv, angle, amount);
    vec4 blend = flow;

    // FragColor = blendAdd(base, blend, 1.0);
    FragColor = blendAdd(base, blend, 0.6);
    // FragColor = blendAlpha(base, blend, 1.0);
    // FragColor = blendAverage(base, blend, 1.0);
    // FragColor = blendColorBurn(base, blend, 1.0);
    // FragColor = blendColorDodge(base, blend, 1.0);
    // FragColor = blendDarken(base, blend, 1.0);
    // FragColor = blendDifference(base, blend, 1.0);
    // FragColor = blendDivide(base, blend, 1.0);
    // FragColor = blendExclusion(base, blend, 1.0);
    // FragColor = blendLighten(base, blend, 1.0);
    // FragColor = blendMultiply(base, blend, 1.0);
    // FragColor = blendNegation(base, blend, 1.0);
    // FragColor = blendNormal(base, blend, 1.0);
    // FragColor = blendOverlay(base, blend, 1.0);
    // FragColor = blendReflect(base, blend, 1.0);
    // FragColor = blendScreen(base, blend, 1.0);
    // FragColor = blendSoftLight(base, blend, 1.0);
    // FragColor = blendSubtract(base, blend, 1.0);

    // Blend with background color
    // base = FragColor;
    // blend = vec4(vec3(0.066), 1.0);

    // FragColor = blendScreen(base, blend, 1.0);
}
`;
