const gulp = require('gulp');
const git = require('gulp-git');
const bump = require('gulp-bump');
const filter = require('gulp-filter');
const tag_version = require('gulp-tag-version');

const spawn = require('child_process').spawn;
const coffee = require('gulp-coffee');
const gutil = require('gulp-util');
const uglify = require("gulp-uglify");
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const minifyCSS = require('gulp-minify-css');
const serve = require('gulp-serve');

function clean(cb) {
  // body omitted
  cb();
}

function Css(cb) {
    makeCss();
  
    cb();
  } 

  function Js(cb) {
    makeJs();
    cb();
  } 


function makeCss() {
  
    gulp.src('./dist/pivot.css')
        .pipe(minifyCSS())
        .pipe(concat('pivot.min.css'))//trick to output to new file
        .pipe(gulp.dest('./dist/'))
    
 
}

function makeJs() {
  
 
    gulp.src(['./src/*.coffee', './locales/*.coffee', './tests/*.coffee'])
        //compile to js (and create map files)
        .pipe(sourcemaps.init())
        .pipe(coffee()).on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'))
      
        //minify js files as well
        .pipe(filter('*.js'))//filter, to avoid doing this processing on the map files generated above
         .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.init({loadMaps: true}))//load the source maps generated in the first step
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
  
}


const watcher = gulp.watch(['./src/*.coffee', './locales/*.coffee', './tests/*.coffee','./dist/pivot.css']);

  watcher.on('change', function(path, stats) {
      console.log('change');
    makeJs();
  });
  
  watcher.on('add', function(path, stats) {
    console.log('add');
    makeJs();
  });
  
  watcher.on('unlink', function(path, stats) {
    console.log('unlink');
    makeJs();
  });

exports.default = gulp.series(clean, gulp.parallel(Css, Js));