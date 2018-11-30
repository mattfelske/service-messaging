const { src, dest, series } = require('gulp');

const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const webpack = require('webpack-stream');
// const del        = require('del');


const DEST = 'public/dist';
const DEST_LIB = 'public/dist/lib';
const DEST_FONTS = 'public/dist/fonts';
const DEST_ICONS = 'public/dist/icons';

// The `clean` function is not exported so it can be considered a private task.
// It can still be used within the `series()` composition.
function clean(cb) {
  // return del([`${DEST}/*`], {dot: true});
  // body omitted
  cb();
}


function streamTask() {
  return src('src/lib/**/*').pipe(dest(DEST_LIB));
}


function build() {
  return src('src/*.js')
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('dist/'));
}

function b2() {
  return src('src/index.js')
    .pipe(webpack(require('./webpack')))
    .pipe(dest('public/dist/'));
}

exports.build = build;
exports.default = series(clean, b2, streamTask);
