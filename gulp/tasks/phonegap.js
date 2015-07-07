'use strict';

var gulp = require('gulp');
var version = require('../../package.json').version;

gulp.task('phonegap-clean', function (cb) {
    var del = require('del');
    del(['www'], cb);
});

gulp.task('insert-cordova-js', function () {
    var insertLines = require('gulp-insert-lines');
    return gulp.src('./www/index.html')
        .pipe(insertLines({
            'before': /<\/head>$/,
            'lineBefore': '<script src="cordova.js"></script>'
        }))
        .pipe(gulp.dest('./www'));
});

gulp.task('phonegap-copy', function () {
    return gulp.src(['build/**/*', 'config.xml', 'resource*/**/*.png'])
        .pipe(gulp.dest('./www'));
});

gulp.task('phonegap-version', function () {
    var replace = require('gulp-replace');
    return gulp.src('www/config.xml')
        .pipe(replace('versionFromPackageJson', version))
        .pipe(gulp.dest('./www'));
});

gulp.task('phonegap-build', function () {
    var file = require('gulp-file');
    var phonegapBuild = require('gulp-phonegap-build');
    var config = require('../../.phonegap.json');
    var pathWithoutExt = 'release/norgesruter.' + version;

    return gulp.src('./www/**/*')
        .pipe(file('resources/.pgbomit', ''))
        .pipe(phonegapBuild({
            timeout: 2000000,
            download: {
                ios: pathWithoutExt + '.ipa',
                android: pathWithoutExt + '.apk',
                winphone: pathWithoutExt + '.xap'
            },
            appId: config.appId,
            user: config.user,
            keys: config.keys
        }));
});

gulp.task('phonegap', function (cb) {
    var runSequence = require('run-sequence');
    runSequence(['prod', 'phonegap-clean'], 'phonegap-copy', ['insert-cordova-js', 'phonegap-version'], 'phonegap-build', cb);
});