const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const del = require('del');

const paths = {
  styles: ['./assets/styles/**/*.less'],
};

gulp.task('watch', ['build'], () => {
  gulp.watch(paths.styles, ['styles']);
});

gulp.task('styles', () => (
  gulp.src('./assets/styles/index.less')
    .pipe(plugins.sourcemaps.init())
      .pipe(plugins.less())
      .pipe(plugins.autoprefixer())
      .pipe(plugins.minifyCss())
    .pipe(plugins.sourcemaps.write())
    .pipe(plugins.rename('index.min.css'))
    .pipe(gulp.dest('dist/styles'))
));

gulp.task('rev', ['styles'], () => {
  const revAll = new plugins.revAll(); // eslint-disable-line new-cap

  return gulp.src(['dist/styles/*'])
    .pipe(revAll.revision())
    .pipe(gulp.dest('dist'))
    .pipe(revAll.manifestFile())
    .pipe(gulp.dest('dist'));
});

gulp.task('nodemon', () => {
  plugins.nodemon({
    script: 'server.js',
    ext: 'js html',
  });
});

gulp.task('clean', () => del(['dist']));

gulp.task('build', ['clean', 'styles', 'rev']);
gulp.task('start', ['build', 'nodemon', 'watch']);
