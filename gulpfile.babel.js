'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';
import browserify from 'browserify';
import babelify from 'babelify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import uglify from 'gulp-uglify';
import pump from 'pump';
import sourcemaps from 'gulp-sourcemaps';
import connect from 'gulp-connect-php';
import browserSync from 'browser-sync';
import gutil from "gulp-util";

gulp.task('sass', () => {
 return gulp.src('./src/sass/**/*.scss')
   .pipe(sourcemaps.init())
   .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
   .pipe(sourcemaps.write('./'))
   .pipe(gulp.dest('./public/res/css'));
});

gulp.task('js', () => {
  pump([
        browserify({
          entries: './src/js/main.js',
          debug: true
        })
        .transform(babelify)
        .bundle().on('error', err => {
          gutil.log("!!Browserify Error: ", gutil.colors.red(err.message))
        }),
        source('script.min.js'),
        buffer(),
        sourcemaps.init({loadMaps: true}),
        uglify().on('error', err => {
          gutil.log("!!Uglify Error: ", gutil.colors.red(err.message))
        }),
        sourcemaps.write('.'),
        gulp.dest('./public/res/js'),
    ]
  );
});

gulp.task('connect-sync', () => {
  connect.server({
    hostname: '127.0.0.1',
    port: 5000,
    base: './public'
  }, () => {
    browserSync({
      proxy: '127.0.0.1:5000',
      port: 7000
    });
  });
});

gulp.task('default', ['connect-sync'], () => {
  gulp.watch('./src/sass/**/*.scss', ['sass']);
  gulp.watch('./src/js/**/*.js', ['js']);
  gulp.watch('./public/**/*.*').on('change', browserSync.reload);
});
