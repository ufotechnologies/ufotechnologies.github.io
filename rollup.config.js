import { timestamp, uglify } from 'rollup-plugin-bundleutils';

import replace from 'rollup-plugin-replace';
import glslify from 'rollup-plugin-glslify';
import { eslint } from 'rollup-plugin-eslint';

import { version } from './alien.js/package.json';

export default {
    input: 'src/Main.js',
    output: {
        file: 'public/assets/js/app.js',
        format: 'es'
    },
    plugins: [
        replace({
            'three': '/* global THREE */',
            delimiters: ['import * as THREE from \'', '\';']
        }),
        glslify({ basedir: 'src/shaders' }),
        eslint({ include: ['src/**', 'alien.js/**'], exclude: 'alien.js/src/gsap/**' }),
        uglify({
            output: {
                preamble: `//   _  /._  _  r${version.split('.')[1]} ${timestamp()}\n//  /_|///_'/ /`
            },
            safari10: true
        })
    ]
};
