import commonjs from 'rollup-plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import resolve from 'rollup-plugin-node-resolve'
import serve from 'rollup-plugin-serve'
import sucrase from 'rollup-plugin-sucrase'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import { preprocess, createEnv, readConfigFile } from '@pyoner/svelte-ts-preprocess'
import concat from 'concat'
import fs from 'fs'

const production = !process.env.ROLLUP_WATCH
const env = createEnv()

export default {
  input: 'src/main.ts',
  output: {
    sourcemap: false,
    format: 'iife',
    name: 'app',
    file: 'dist/kecap.js',
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
      css: (css) => {
        css.write(`res/bundle.css`, false)

        // Integrate css
        concat([
          `res/bundle.css`,
          `res/global.css`,
        ]).then(result => fs.writeFileSync(`dist/kecap.css`, result))
      },
    }),

    commonjs({ sourceMap: false }),
    resolve({ browser: true }),
    sucrase({ transforms: ['typescript'] }),

    !production && livereload('dist'),
    !production && serve('./test'),
    production && terser(),
  ],
}
