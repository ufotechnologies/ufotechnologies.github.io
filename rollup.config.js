import { timestamp, terser } from 'rollup-plugin-bundleutils';

import glslify from 'rollup-plugin-glslify';
import { eslint } from 'rollup-plugin-eslint';

import { version } from './alien.js/package.json';

const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/main.js',
    output: {
        file: 'public/assets/js/app.js',
        format: 'iife'
    },
    plugins: [
        glslify({ basedir: 'src/shaders' }),
        eslint({ include: 'src/**' }),
        production && terser({
            output: {
                preamble: `//   _  /._  _  r${version.split('.')[1]} ${timestamp()}\n//  /_|///_'/ /`
            },
            keep_classnames: true,
            keep_fnames: true,
            safari10: true
        })
    ],
    watch: {
        chokidar: true,
        clearScreen: false,
        include: 'src/**'
    }
};
