var gulp = require('gulp');
var shell = require('gulp-shell');
var less = require('gulp-less');
var del = require('del');
var gutil = require('gulp-util');
var copy = require('copy');
var runSequence = require('run-sequence');
var zip = require('gulp-zip');
var cleanCSS = require('gulp-clean-css');
var package = require('./package.json');
var webpack    = require('webpack');
var webpackConfig = require('./webpack.config.js');

var src = './src';
var build = './build';

gulp.task('clean:locales', function () {
    return del(src + '/_locales');
});

gulp.task('clean:build', function () {
    return del(build);
});

gulp.task('less', function () {
    return gulp.src(src + '/styles/!(_)*.less')
            .pipe(less())
            .pipe(cleanCSS())
            .pipe(gulp.dest(src + '/styles'));
});

gulp.task('copy', function () {
    return gulp.src(src + '/{images/**,js/*.bundle.js,styles/*.css,views/*.html,manifest.json,_locales/**}')
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

gulp.task('compile', function(){
    runSequence(
        'clean:locales',
        'translate',
        'less'
    );
});

gulp.task('build', function(){
    var config = Object.create(webpackConfig);
    config.plugins = config.plugins.concat([
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ]);
    webpack(config, function (err, stats) {
        if(err) {
            throw new gutil.PluginError('webpack build', err);
            return;
        }
        gutil.log('webpack build', stats.toString({
            colors: true
        }));
        runSequence(
            'clean:locales',
            'translate',
            'less',
            'clean:build',
            'copy',
            'zip'
        );

    })
});

gulp.task('dev', ['compile'], function(){
    gulp.watch(src + '/styles/**/*.less', ['less']);
    gulp.watch(src + '/dictionary.json', function () {
        runSequence(
            'clean:locales',
            'translate'
        );
    });
});
