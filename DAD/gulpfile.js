/**
 * Created by Veblin on 2/5/16.
 */
var PATH = '';
// gulp file
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-ruby-sass');
var reload = browserSync.reload;
var gutil = require('gulp-util');
var ejs = require("gulp-ejs");


// 静态服务器 + 监听 scss/html 文件
gulp.task('serve', ['sass', 'theme','ejs'], function () {
    browserSync.init({
        port: '8888',
        server: {
            baseDir: PATH,
            directory: true
        }
    });
    gulp.watch(PATH+"_sass/**/*.scss", ['sass','theme']);
    gulp.watch(PATH+"_template/*.html",['ejs']);
    gulp.watch(PATH+"js/**/*.js",['js']);
});

// scss编译后的css将注入到浏览器里实现更新

gulp.task('sass', function () {
    return sass(PATH+"_sass/pages/*.scss")
        .on('error', sass.logError)
        .pipe(gulp.dest(PATH+"css/pages"))
        .pipe(reload({stream: true}));
});
gulp.task('theme', function () {
    return sass(PATH+"_sass/theme/**/*.scss")
        .on('error', sass.logError)
        .pipe(gulp.dest(PATH+"css/theme"))
        .pipe(reload({stream: true}));
});
gulp.task('ejs', function () {
    return gulp.src([PATH+"_template/*.html"])
        .pipe(ejs(
            {},
            {ext: '.html'}
        ).on('error', gutil.log))
        .pipe(gulp.dest(PATH+"_demo"))
        .pipe(reload({stream: true}));
});
gulp.task('js', function () {
    return gulp.src([PATH+"js/**/*.js"])
        .pipe(reload({stream: true}));
});
gulp.task('default', ['serve']);
