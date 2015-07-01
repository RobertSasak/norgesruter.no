'use strict';

var gulp = require('gulp');
var phonegapBuild = require('gulp-phonegap-build');
var config = require('../../.phonegap.json');

gulp.task('phonegap-build', [], function () {
    gulp.src(['build/**/*', 'config.xml', 'resource*/**/*.png'])
        //.pipe(gulp.dest('./phonegap'))
        .pipe(phonegapBuild({
            timeout: 2000000,
            download: {
                ios: 'release/norgesruter.ipa',
                android: 'release/norgesruter.apk',
                winphone: 'release/norgesruter.xap'
            },
            appId: config.appId,
            user: config.user,
            keys: config.keys
        }));
});