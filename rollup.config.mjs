import dts from 'rollup-plugin-dts';
import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

import packageJson from './package.json' assert { type: 'json' };

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.main,
                format: 'cjs',
                name: 'ReactQrScanner',
                sourcemap: true,
                globals: { react: 'React' },
                exports: 'named'
            },
            {
                file: packageJson.module,
                format: 'esm',
                name: 'ReactQrScanner',
                sourcemap: true,
                globals: { react: 'React' },
                exports: 'named'
            }
        ],
        plugins: [
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json',
                exclude: ['**/stories/**']
            }),
            copy({
                targets: [
                    { src: 'src/assets/*', dest: 'dist/assets' }
                ]
            }),
            terser()],
        external: [
            'react',
            'react-dom',
            'barcode-detector',
            'webrtc-adapter/dist/chrome/getusermedia',
            'webrtc-adapter/dist/firefox/getusermedia',
            'webrtc-adapter/dist/safari/safari_shim',
            'webrtc-adapter/dist/utils'
        ]
    },
    {
        input: 'dist/esm/index.d.ts',
        output: [
            {
                file: 'dist/index.d.ts',
                format: 'esm',
                chunkFileNames: '[name].js'
            }
        ],
        plugins: [dts()]
    }
];
