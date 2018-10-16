// Based on https://github.com/CODAME/clonicoptics-video-capture by CODAME

const float speed = 0.5;
const float rollSpeed = 0.0;

#pragma glslify: snoise = require('glsl-noise/simplex/2d')

vec4 getBadTV(sampler2D tDiffuse, vec2 uv, float uTime, float distortion, float distortion2) {
    vec2 p = uv;
    float ty = uTime * speed;
    float yt = p.y - ty;

    // smooth distortion
    float offset = snoise(vec2(yt * 3.0, 0.0)) * 0.2;

    // boost distortion
    offset = pow(offset * distortion, 3.0) / distortion;

    // add fine grain distortion
    offset += snoise(vec2(yt * 50.0, 0.0)) * distortion2 * 0.001;

    // combine distortion on X with roll on Y
    return texture2D(tDiffuse, vec2(fract(p.x + offset), fract(p.y - uTime * rollSpeed)));
}

#pragma glslify: export(getBadTV)
