import dts from 'rollup-plugin-dts';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';

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
                exports: 'named',
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
        onwarn: (warning, warn) => {
            if (warning.code === 'THIS_IS_UNDEFINED') return;
            warn(warning); // this requires Rollup 0.46
        },
        plugins: [peerDepsExternal(), resolve(), commonjs(), typescript({
            tsconfig: './tsconfig.json',
            exclude: ['**/stories/**']
        }), terser()],
        external: ['react', 'react-dom', 'styled-components']
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
