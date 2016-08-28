'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var sourcemaps = require("gulp-sourcemaps");
var source = require('vinyl-source-stream');
var babel = require('rollup-plugin-babel');
var rollup = require('rollup-stream');
var buffer = require('vinyl-buffer');


const includePathOptions = {
    paths: ['src']
};

function handleError(error) {
    console.log(error);
    this.emit('end');
}

gulp.task('serve', ['sass', 'javascript'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch('./src/**/*.js', ['javascript']);
    gulp.watch("./sass/*.scss", ['sass']);
    gulp.watch("./*.html").on('change', browserSync.reload);
    gulp.watch("./src/**/*.js").on('change', browserSync.reload);
});

gulp.task('sass', function() {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', handleError))
        .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function() {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('modules', function() {
  return gulp.src('node_modules/three/build/*.js')
    .pipe(gulp.dest('./js/'));
})

gulp.task('javascript', function() {
    return rollup({
            entry: './src/app.js',
            plugins: [
                babel({
                    exclude: 'node_modules/**',
                    presets: ['es2015-rollup'],
                }),
            ],
        }).on('error', handleError)
        .pipe(source('app.js'))
				.pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./js/'));
});
