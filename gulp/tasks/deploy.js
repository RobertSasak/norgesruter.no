'use strict';

var config = require('../config');
var gulp = require('gulp');
var file = require('gulp-file');
var gulpGhPages = require('gulp-gh-pages');

gulp.task('deploy', ['prod'], function () {
	return gulp.src('./build/**/*')
		.pipe(file('CNAME', config.deploy.cname))
		.pipe(gulpGhPages({
			remoteUrl: 'git@github.com:RobertSasak/norgesruter.no.git'
		}));
});