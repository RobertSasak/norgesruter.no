var gulp = require('gulp');
var manifest = require('gulp-manifest');

gulp.task('manifest', function () {
	gulp.src(['build/**/*'])
		.pipe(manifest({
			hash: true,
			preferOnline: true,
			network: ['*'],
			filename: 'app.manifest',
			exclude: 'app.manifest'
		}))
		.pipe(gulp.dest('build'));
});