const { src, dest, series, parallel, watch } = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');

function copyHtml() {
    return src(['src/*.html']).pipe(dest('dist'));
}

function browserifyTs() {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/boilerplate/game.ts'],
        cache: {},
        packageCache: {},
    })
        .plugin(tsify)
        .bundle()
        .on('error', e => console.error(e))
        .pipe(source('bundle.js'))
        .pipe(dest('dist'));
}

exports.watch = () => watch(['src/**/*.*'], parallel(copyHtml, browserifyTs));
exports.default = parallel(copyHtml, browserifyTs);
