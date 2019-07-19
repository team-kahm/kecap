import commonjs from 'rollup-plugin-commonjs'
import copy from 'rollup-plugin-copy'
import livereload from 'rollup-plugin-livereload'
import resolve from 'rollup-plugin-node-resolve'
import serve from 'rollup-plugin-serve'
import sucrase from 'rollup-plugin-sucrase'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import { preprocess, createEnv, readConfigFile } from '@pyoner/svelte-ts-preprocess'

const production = !process.env.ROLLUP_WATCH
const env = createEnv()

export default {
  input: 'src/main.ts',
  output: {
    sourcemap: false,
    format: 'iife',
    name: 'app',
    file: 'dist/bundle.js',
  },
  plugins: [
    svelte({
      dev: !production,
      preprocess: preprocess({
        env,
        compilerOptions: {
          ...readConfigFile(env),
          allowNonTsExtensions: true,
        },
      }),
      css: css => css.write('dist/bundle.css', false),
    }),

    commonjs({ sourceMap: false }),
    resolve({ browser: true }),
    sucrase({ transforms: ['typescript'] }),

    copy({ targets: [{ src: 'res/*', dest: 'dist' }] }),

    !production && livereload('dist'),
    !production && serve('./test'),
    production && terser(),
  ],
}
