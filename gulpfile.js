var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('build-js', function () {
    gulp.src('src/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest('build/'));
});

gulp.task('default', ['build-js'], function () {
    return gutil.log('All tasks done.');
})