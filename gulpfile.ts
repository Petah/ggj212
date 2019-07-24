const { src, dest, series, parallel, watch } = require('gulp');
const flatten = require('gulp-flatten');
const del = require('del');
const { exec } = require('child_process');
const version = require('gulp-version-number');


function copyHtml() {
    return src([
        'src/*.html',
    ]).pipe(dest('dist'));
}

function versionHtml() {
    return src('dist/*.html')
        .pipe(version({
            append: {
                to: [
                    {
                        type: 'css',
                        attr: ['href'],
                        key: 'version',
                        value: '%DT%',
                        files: ['styles.css'],
                    },
                    {
                        type: 'js',
                        attr: ['src'],
                        key: 'version',
                        value: '%DT%',
                        files: ['bundle.js'],
                    },
                ],
            },
        }))
        .pipe(dest('dist'));
}

function copyCss() {
    return src([
        'src/*.css',
    ]).pipe(dest('dist'));
}

function copyAssets() {
    return src([
        'src/boilerplate/**/*.json',
        'src/boilerplate/**/*.png',
    ])
        // .pipe(flatten({ includeParents: -2 }))
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

function watchBuild() {
    return watch(['src/**/*.*'], build);
}

const build = series(parallel(copyHtml, copyCss, copyAssets, rollup), versionHtml);

exports.clean = clean;
exports.build = build;
exports.watch = series(build, watchBuild);
exports.default = build;
