import { timestamp, uglify } from 'rollup-plugin-bundleutils';

import glslify from 'rollup-plugin-glslify';
import { eslint } from 'rollup-plugin-eslint';

import replace from 'replace';

const pkg = require('./alien.js/package.json');

replace({
    regex: `'assets/js/.*\.js.*'`,
    replacement: `'assets/js/app.js?v=${Date.now()}'`,
    paths: ['public/index.html'],
    recursive: false,
    silent: true
});

export default {
    input: 'src/Main.js',
    output: {
        file: 'public/assets/js/app.js',
        format: 'es'
    },
    plugins: [
        glslify({ basedir: 'src/shaders' }),
        eslint(),
        uglify({
            output: {
                preamble: `//   _  /._  _  r${pkg.version.split('.')[1]} ${timestamp()}\n//  /_|///_'/ /`
            },
            safari10: true
        })
    ]
};
