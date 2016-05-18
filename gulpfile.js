'use strict';

const path = require('path');
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const del = require('del');
const webpack = require('webpack-stream');

const paths = {
  styles: ['./assets/styles/**/*'],
  images: ['./assets/images/**/*'],
  fonts: ['./assets/fonts/**/*'],
  clientsideJS: ['./assets/js/**/*'],
};

const sassIncludePaths = [
  path.join(__dirname, 'node_modules'),
  ...require('bourbon').includePaths,
  ...require('bourbon-neat').includePaths,
];

gulp.task('watch', ['build'], () => {
  gulp.watch([
    paths.styles,
    paths.clientsideJS,
  ], ['rev']);
});

gulp.task('styles:vendor', () => (
  gulp.src('./assets/styles/vendor.scss')
    .pipe(plugins.sass({
      includePaths: sassIncludePaths,
    }).on('error', plugins.sass.logError))
    .pipe(plugins.cssnano())
    .pipe(plugins.rename('vendor.min.css'))
    .pipe(gulp.dest('dist/styles'))
));

gulp.task('styles', ['styles:vendor'], () => (
  gulp.src('./assets/styles/index.scss')
    .pipe(plugins.sourcemaps.init())
      .pipe(plugins.sass({
        includePaths: sassIncludePaths,
      }).on('error', plugins.sass.logError))
      .pipe(plugins.autoprefixer())
      .pipe(plugins.cssnano())
    .pipe(plugins.sourcemaps.write())
    .pipe(plugins.rename('index.min.css'))
    .pipe(gulp.dest('dist/styles'))
));

gulp.task('js', () => (
  gulp.src('./assets/js/**/*.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/js'))
));

gulp.task('images', () => (
  gulp.src(paths.images)
    .pipe(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/images'))
));

gulp.task('fonts', () => (
  gulp.src(paths.fonts)
    .pipe(gulp.dest('dist/fonts'))
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
    ignore: [
      'dist/js',
      'dist/styles',
    ],
    ext: 'js html json',
  });
});

gulp.task('clean', () => del.sync(['dist']));

gulp.task('build', ['clean', 'images', 'fonts', 'rev']);
