var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var filter = require('gulp-filter');

// Compile LESS files from /less into /css
gulp.task('less', function () {
  var f = filter(['**', '!less/mixins.less', '!less/variables.less']);
  return gulp.src('less/*.less')
    .pipe(f)
    .pipe(less())
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function () {
  return gulp.src('public/css/styles.css')
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Minify JS
gulp.task('minify-js', function () {
  return gulp.src('js/index.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('js'))
    .pipe(browserSync.reload({
      stream: true
    }));
});


// Run everything
gulp.task('default', ['less', 'minify-css']);

// Configure the browserSync task
gulp.task('browserSync', function () {
  browserSync.init({
    server: 'public'
  });
});

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'less', 'minify-css', 'minify-js'], function () {
  gulp.watch('less/*.less', ['less']);
  gulp.watch('public/css/*.css', ['minify-css']);
  gulp.watch('js/*.js', ['minify-js']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('*.html', browserSync.reload);
  gulp.watch('js/**/*.js', browserSync.reload);
});
