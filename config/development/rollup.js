import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'


import {
    preprocess,
    createEnv,
    readConfigFile,
} from "@pyoner/svelte-ts-preprocess"

const env = createEnv()
const compilerOptions = readConfigFile(env)
const opts = {
    env,
    compilerOptions: {
        ...compilerOptions,
        allowNonTsExtensions: true,
    }
}


export default {
    input: 'src/main.ts',
    output: {
        sourcemap: false,
        format: 'iife',
        name: 'app',
        file: 'dist/bundle.js'
    },
    plugins: [

        svelte({
            // enable run-time checks when not in production
            dev: true,
            // we'll extract any component CSS out into
            // a separate file  better for performance
            css: css => {
                css.write('dist/bundle.css', false)
            },
            preprocess: preprocess(opts)
        }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration 
        // consult the documentation for details:
        // https://github.com/rollup/rollup-plugin-commonjs
        resolve(),
        commonjs({
            sourceMap: false
        }),
        typescript({ cacheRoot: `${require('temp-dir')}/.rpt2_cache` }),
    ]
}
