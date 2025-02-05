import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

import packageJson from './package.json' with { type: 'json' };

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                dir: 'dist',
                format: 'cjs',
                entryFileNames: '[name].cjs.js',
                sourcemap: true
            },
            {
                dir: 'dist',
                format: 'esm',
                entryFileNames: '[name].esm.mjs',
                sourcemap: true
            }
        ],
        plugins: [
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json',
                compilerOptions: {
                    declaration: true,
                    declarationDir: 'dist'
                },
                exclude: ['**/stories/**']
            }),
            terser()
        ],
        external: [
            'react',
            'react-dom',
            'barcode-detector',
            'webrtc-adapter/dist/chrome/getusermedia',
            'webrtc-adapter/dist/firefox/getusermedia',
            'webrtc-adapter/dist/safari/safari_shim',
            'webrtc-adapter/dist/utils'
        ]
    }
];
