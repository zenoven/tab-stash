var gulp = require('gulp');
var shell = require('gulp-shell');
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

gulp.task('copy', function () {
    return gulp.src(src + '/{images/**,js/*.bundle.js,views/**,manifest.json,_locales/**}')
        .pipe(gulp.dest(build));
});

gulp.task('translate', shell.task([
    'chrome-i18n -f ' + src + '/dictionary.json'
]) );

gulp.task('zip', function () {
    return gulp.src('build/*')
        .pipe(zip(package.name + '-' + package.version + '.zip'))
        .pipe(gulp.dest(build));
});

gulp.task('default', function(){
    runSequence(
        'clean:locales',
        'clean:build',
        'translate',
        'copy',
        'zip'
    );
});
