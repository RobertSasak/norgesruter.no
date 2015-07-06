'use strict';

var gulp = require('gulp');
var phonegapBuild = require('gulp-phonegap-build');
var insertLines = require('gulp-insert-lines');
var config = require('../../.phonegap.json');
var version = require('../../package.json').version;
var pathWithoutExt = 'release/norgesruter.' + version;
var replace = require('gulp-replace');

gulp.task('templates', function () {
    gulp.src(['file.txt'])
        .pipe(gulp.dest('build/file.txt'));
});

var files = ['build/**/*', 'config.xml', 'resource*/**/*.png'];


gulp.task('insert-cordova-js', ['prod'], function () {
    gulp.src('./build/index.html')
        .pipe(insertLines({
            'before': /<\/head>$/,
            'lineBefore': '<script src="cordova.js"></script>'
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('phonegap-www', ['insert-cordova-js'], function () {
    gulp.src(files)
        .pipe(replace('versionFromPackageJson', version))
        .pipe(gulp.dest('./www'));
});

gulp.task('phonegap-build', ['insert-cordova-js'], function () {
    gulp.src(files)
        .pipe(replace('versionFromPackageJson', version))
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