import resolve from '@rollup/plugin-node-resolve';
import { babel, terser, timestamp } from 'rollup-plugin-bundleutils';

const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/main.js',
    preserveEntrySignatures: 'allow-extension',
    output: {
        dir: 'public/assets/js',
        entryFileNames: 'loader.js',
        chunkFileNames: 'main.js',
        format: 'es',
        minifyInternalExports: false
    },
    plugins: [
        resolve({
            browser: true
        }),
        production && babel({
            compact: false,
            presets: [],
            plugins: ['@babel/plugin-proposal-class-properties']
        }),
        production && terser({
            output: {
                preamble: `// ${timestamp()}`
            },
            keep_classnames: true,
            keep_fnames: true
        })
    ]
};
