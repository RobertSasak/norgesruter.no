'use strict';

var gulp = require('gulp');
var gulpGhPages = require('gulp-gh-pages');

gulp.task('deploy', ['prod'], function () {
	return gulp.src('./build/**/*')
		.pipe(gulpGhPages());
});