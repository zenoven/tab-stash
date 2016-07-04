var gulp = require('gulp');
var shell = require('gulp-shell');
var less = require('gulp-less');
var del = require('del');
var copy = require('copy');
var runSequence = require('run-sequence');
var zip = require('gulp-zip');
var package = require('./package.json');

var src = './src';
var build = './build';

gulp.task('clean:locales', function () {
    return del(src + '/_locales');
});

gulp.task('clean:build', function () {
    return del(build);
});

gulp.task('less', function () {
    console.log('less ... ')
    return gulp.src(src + '/styles/*.less')
            .pipe(less())
            .pipe(gulp.dest(src + '/styles'));
});

gulp.task('copy', function () {
    return gulp.src(src + '/{images/**,js/*.bundle.js,styles/*.css,views/**,manifest.json,_locales/**}')
        .pipe(gulp.dest(build));
});

gulp.task('translate', shell.task([
    'chrome-i18n -f ' + src + '/dictionary.json'
]) );

gulp.task('zip', function () {
    return gulp.src('build/**')
        .pipe(zip(package.name + '-' + package.version + '.zip'))
        .pipe(gulp.dest(build));
});

gulp.task('basic', function(){
    runSequence(
        'clean:locales',
        'translate',
        'less'
    );
});

gulp.task('build', function(){
    runSequence(
        'clean:locales',
        'translate',
        'less',
        'clean:build',
        'copy',
        'zip'
    );
});

gulp.task('dev', ['basic'], function(){
    gulp.watch(src + '/{styles/*.less,dictionary.json}', ['basic']);
});
