import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

import packageJson from './package.json' with { type: 'json' };

export default [
    {
        input: 'src/index.ts',
        output: {
            file: packageJson.main,
            format: 'cjs',
            name: 'ReactQrScanner',
            sourcemap: true,
            globals: { react: 'React' },
            exports: 'named'
        },
        plugins: [
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json',
                compilerOptions: {
                    declaration: true,
                    declarationDir: 'dist/cjs'
                },
                exclude: ['**/stories/**']
            }),
            copy({
                targets: [{ src: 'src/assets/*', dest: 'dist/assets' }]
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
    },
    {
        input: 'src/index.ts',
        output: {
            file: packageJson.module,
            format: 'esm',
            name: 'ReactQrScanner',
            sourcemap: true,
            globals: { react: 'React' },
            exports: 'named'
        },
        plugins: [
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json',
                compilerOptions: {
                    declaration: true,
                    declarationDir: 'dist/esm'
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
