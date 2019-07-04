import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import minify from 'rollup-plugin-babel-minify'

import {
    preprocess,
    createEnv,
    readConfigFile
} from "@pyoner/svelte-ts-preprocess"

const env = createEnv()
const compilerOptions = readConfigFile(env)
const opts = {
    env,
    compilerOptions: {
        ...compilerOptions,
        allowNonTsExtensions: true
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
            dev: false,
            // we'll extract any component CSS out into
            // a separate file  better for performance
            css: css => {
                // second argument is sourceMap = false
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
        typescript({
            tsconfig: "tsconfig.json",
            cacheRoot: `${require('temp-dir')}/.rpt2_cache`
        }),
        
        minify(),
    ]
}
