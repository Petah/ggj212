const { src, dest, series, parallel, watch } = require('gulp');
const flatten = require('gulp-flatten');
const del = require('del');
const { exec } = require('child_process');

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

function rollup(done: (error: string) => void) {
    exec('npx rollup -c rollup.config.js', (error: string, stdout: string, stderr: string) => {
        if (stderr) {
            console.error(stderr);
        }
        if (stdout) {
            console.log(stdout);
        }
        done(error);
    });
}

function clean() {
    return del([
        'dist/**/*',
        'built/**/*',
    ]);
}

const build = parallel(copyHtml, copyAssets, rollup);

exports.clean = clean;
exports.build = build;
exports.watch = () => watch(['src/**/*.*'], build);
exports.default = build;
