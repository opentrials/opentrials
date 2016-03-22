const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const del = require('del');
const webpack = require('webpack-stream');

const paths = {
  styles: ['./assets/styles/**/*.scss'],
  images: ['./assets/images/**/*'],
};

gulp.task('watch', ['build'], () => {
  gulp.watch(paths.styles, ['styles']);
});

gulp.task('styles:vendor', () => (
  gulp.src('./assets/styles/vendor.scss')
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.cssnano())
    .pipe(plugins.rename('vendor.min.css'))
    .pipe(gulp.dest('dist/styles'))
));

gulp.task('styles', ['styles:vendor'], () => (
  gulp.src('./assets/styles/index.scss')
    .pipe(plugins.sourcemaps.init())
      .pipe(plugins.sass().on('error', plugins.sass.logError))
      .pipe(plugins.autoprefixer())
      .pipe(plugins.cssnano())
    .pipe(plugins.sourcemaps.write())
    .pipe(plugins.rename('index.min.css'))
    .pipe(gulp.dest('dist/styles'))
));

gulp.task('js:vendor', () => (
  gulp.src('./assets/js/**/*.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/js'))
));

gulp.task('js', ['js:vendor']);

gulp.task('images', () => (
  gulp.src(paths.images)
    .pipe(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/images'))
));

gulp.task('rev', ['js', 'styles'], () => {
  const revAll = new plugins.revAll(); // eslint-disable-line new-cap

  return gulp.src(['dist/styles/*', 'dist/js/*'])
    .pipe(revAll.revision())
    .pipe(gulp.dest('dist'))
    .pipe(revAll.manifestFile())
    .pipe(gulp.dest('dist'));
});

gulp.task('dev', ['watch'], () => {
  plugins.nodemon({
    script: 'server.js',
    ext: 'js html',
    execMap: 'node --use_strict',
  });
});

gulp.task('clean', () => del.sync(['dist']));

gulp.task('build', ['clean', 'images', 'rev']);
