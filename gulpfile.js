const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const del = require('del');

const paths = {
  styles: ['./assets/styles/**/*.less'],
  images: ['./assets/images/**/*'],
};

gulp.task('watch', ['build'], () => {
  gulp.watch(paths.styles, ['styles']);
});

gulp.task('styles:vendor', () => (
  gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
    .pipe(plugins.cssnano())
    .pipe(plugins.rename('vendor.min.css'))
    .pipe(gulp.dest('dist/styles'))
));

gulp.task('styles', ['styles:vendor'], () => (
  gulp.src('./assets/styles/index.less')
    .pipe(plugins.sourcemaps.init())
      .pipe(plugins.less())
      .pipe(plugins.autoprefixer())
      .pipe(plugins.cssnano())
    .pipe(plugins.sourcemaps.write())
    .pipe(plugins.rename('index.min.css'))
    .pipe(gulp.dest('dist/styles'))
));

gulp.task('images', () => (
  gulp.src(paths.images)
    .pipe(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/images'))
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
    execMap: 'node --use_strict',
  });
});

gulp.task('clean', () => del(['dist'], { force: true }));

gulp.task('build', ['clean', 'styles', 'images', 'rev']);
gulp.task('dev', ['build', 'nodemon', 'watch']);
