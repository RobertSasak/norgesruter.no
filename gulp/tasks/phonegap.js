'use strict';

var gulp = require('gulp');
var phonegapBuild = require('gulp-phonegap-build');
var config = require('../../.phonegap.json');
var version = require('../../package.json').version;
var pathWithoutExt = 'release/norgesruter' + version;

var files = ['build/**/*', 'config.xml', 'resource*/**/*.png'];

gulp.task('phonegap-www', ['prod'], function () {
    gulp.src(files)
        .pipe(gulp.dest('./phonegap'));
});

gulp.task('phonegap-build', ['prod'], function () {
    gulp.src(files)
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