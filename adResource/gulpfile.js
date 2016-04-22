var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var sass = require('gulp-ruby-sass');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
    cache = require('gulp-cache'),
    gutil = require('gulp-util');
//定义sass文件的目录
var _cssList = './sass/*.scss';
//自动刷新任务及目录，端口不行不会自动刷新
gulp.task('browser-sync', function() {
    browserSync.init({
        port:"8080",
        server: {
            baseDir: "/home/webroot/apps/cutPhoto--adResource]"
        }
    });
    gulp.run('watch');
});
//sass转化成css任务
gulp.task('styles', function() {
    return sass(_cssList, { style: 'expanded' })
        .on('error', function(err) {
            gutil.log('Sass Error!', err.message);
            this.end();
        })
        .pipe(autoprefixer('last 2 version'))
        //将 所有css文件打包成一个文件，html中链接这一个文件即可
        .pipe(concat('style.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./css'));
});
//随时监听任务
gulp.task('watch', function() {
    gulp.watch(_cssList, ['styles']);
});
//运行函数
gulp.task('concat',function(){
    gulp.run('styles');
});

//运行Gulp时，默认的Task
gulp.task('default', ['browser-sync', 'concat']);
gulp.task('push', ['concat']);