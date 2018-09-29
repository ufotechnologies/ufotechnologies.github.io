import { timestamp, uglify } from 'rollup-plugin-bundleutils';

//import glslify from 'rollup-plugin-glslify';
import { eslint } from 'rollup-plugin-eslint';

import path from 'path';
import replace from 'replace';

const pkg = require('./alien.js/package.json'),
    project = path.basename(__dirname);

replace({
    regex: `'assets/js/.*\.js.*'`,
    replacement: `'assets/js/${project}.js?v=${Date.now()}'`,
    paths: ['dist/index.html'],
    recursive: false,
    silent: true
});

export default {
    input: 'src/Main.js',
    output: {
        file: `dist/assets/js/${project}.js`,
        format: 'es'
    },
    plugins: [
        //glslify({ basedir: 'src/shaders' }),
        eslint(),
        uglify({
            output: {
                preamble: `//   _  /._  _  r${pkg.version.split('.')[1]}.${project} ${timestamp()}\n//  /_|///_'/ /`
            }
        })
    ]
};
