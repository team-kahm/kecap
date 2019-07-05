import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';
import livereload from 'rollup-plugin-livereload';
import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'dist/bundle.js',
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into a separate file — better for performance
      css: css => css.write('dist/bundle.css'),
    }),

    // If you have external dependencies installed from npm, you'll most likely need these plugins.
    // In some cases you'll need additional configuration — consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({ browser: true }),
    commonjs(),

    copy({
      targets: [{ src: 'public/*', dest: 'dist' }],
    }),

    // Watch the `dist` directory and refresh the browser on changes when not in production
    !production && livereload('dist'),
    !production && serve('dist'),

    // If we're building for production (npm run build instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
