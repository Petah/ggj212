const { src, dest, series, parallel, watch } = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const ts = require('gulp-typescript');
const flatten = require('gulp-flatten');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const vueify = require('vueify');

function copyHtml() {
    return src([
        'src/*.html',
        'src/*.css',
    ]).pipe(dest('dist'));
}

function copyAssets() {
    return src([
        'src/**/*.json',
        'src/**/*.png',
    ])
        .pipe(flatten({ includeParents: -1 }))
        .pipe(dest('dist'));
}

function copyVue() {
    return src([
        'src/**/*.vue',
    ])
        .pipe(flatten({ includeParents: -2 }))
        .pipe(dest('built'));
}

function browserifyTs() {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['built/game.js'],
        cache: {},
        packageCache: {},
    })
        .transform(vueify)
        .transform('babelify', { presets: ['@babel/preset-env'] })
        .bundle()
        .on('error', e => console.error(e))
        .pipe(source('bundle.js'))
        .pipe(dest('dist'));
}

function compileTs() {
    const tsProject = ts.createProject('tsconfig.json');
    const tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject());
    return tsResult.js
        .pipe(sourcemaps.write())
        .pipe(dest('built'));
}

function clean() {
    return del([
        'dist/**/*',
        'built/**/*',
    ]);
}

const build = series(parallel(copyVue, copyHtml, compileTs), browserifyTs);

exports.clean = clean;
exports.html = parallel(copyHtml, copyAssets);
exports.vue = copyVue;
exports.build = build;
exports.ts = compileTs;
exports.watch = () => watch(['src/**/*.*'], build);
exports.default = build;
