/* eslint-disable */
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');

const paths = {
    scripts: ['./*.js', '!./gulpfile.js']
};

gulp.task('lint', () => gulp.src(paths.scripts)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));

gulp.task('test', () => gulp.src('./test/*.js')
    .pipe(mocha({ reporter: 'spec' })));

gulp.task('watch', () => {
    gulp.watch(paths.scripts, gulp.parallel('lint', 'test'));
});

gulp.task('default', gulp.parallel('lint', 'test', 'watch'));
