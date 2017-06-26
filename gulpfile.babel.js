'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';
import iife from "gulp-iife";
import concat from "gulp-concat";
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';
import pump from 'pump';
import sourcemaps from 'gulp-sourcemaps';
import connect from 'gulp-connect-php';
import browserSync from 'browser-sync';

gulp.task('sass', () => {
 return gulp.src('./src/sass/**/*.scss')
   .pipe(sourcemaps.init())
   .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
   .pipe(sourcemaps.write('./'))
   .pipe(gulp.dest('./public/res/css'));
});


gulp.task('js', (cb) => {
  pump([
        gulp.src(['src/js/modules/*.module.js', 'src/js/*.js', 'src/js/**/*.js']),
        sourcemaps.init(),
        iife(),
        babel(),
        concat('script.min.js'),
        uglify(),
        sourcemaps.write('.'),
        gulp.dest('./public/res/js')
    ],
    cb
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