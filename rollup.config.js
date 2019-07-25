import vue from 'rollup-plugin-vue';
import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/boilerplate/game.ts',
    output: {
        format: 'umd',
        file: 'dist/bundle.js',
        name: 'test',
        globals: {
            'vue': 'Vue',
            'vue-class-component': 'VueClassComponent',
        },
    },
    external: ['vue', 'phaser', 'math', 'vue-class-component'],
    plugins: [
        commonjs(),
        typescript({
            tsconfig: __dirname + '/tsconfig.json',
        }),
        vue(),
    ],
};
