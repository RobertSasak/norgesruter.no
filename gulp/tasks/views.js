'use strict';

var config = require('../config');
var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var htmlmin = require('gulp-html-minifier');

// Views task
gulp.task('views', function () {

	// Put our index.html in the dist folder
	gulp.src('app/index.html')
		.pipe(gulp.dest(config.dist.root));

	// Process any other view files from app/views
	return gulp.src(config.views.src)
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true,
			removeAttributeQuotes: true
		}))
		.pipe(templateCache({
			standalone: true,

		}))
		.pipe(gulp.dest(config.views.dest));

});