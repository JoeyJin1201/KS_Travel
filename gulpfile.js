'use strict';

var gulp = require('gulp'); // 將 node_modules 的檔案載入
var sass = require('gulp-sass');

sass.compiler = require('node-sass');

gulp.task('sass', function () { // 定義 sass 的任務名稱
  return gulp.src('./sass/**/*.scss') // sass 的來源資料夾
    .pipe(sass.sync().on('error', sass.logError)) // sass 的輸出格式
    .pipe(gulp.dest('./css')); // sass 編譯完成後的匯出資料夾
});

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', function () {
    return gulp.src('./sass/**/*.scss') // sass 的來源資料夾
      .pipe(sass.sync().on('error', sass.logError)) // sass 的輸出格式
      .pipe(gulp.dest('./css')); // sass 編譯完成後的匯出資料夾
  });
  // 監控資料夾，當有變化時執行 'sass' 任務
});