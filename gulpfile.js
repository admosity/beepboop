process.env.UV_THREADPOOL_SIZE = 100;
var gulp = require('gulp');
var jade = require('gulp-jade');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var webpack = require('webpack-stream');

var fs = require('fs');
var browserSync = require('browser-sync').create();
var merge = require('merge2');
var named = require('vinyl-named');
var _webpack = require('webpack');

var child_process = require('child_process'),
  exec = child_process.exec;


var child_processes = [];


/**
 *
 *
 *
 *  CONFIGURATIONS
 *
 *
 *
 */


var serverErrorHandler = function(err) {
  this.emit('end');
};

/**
 * Task for generating the scripts in production mode.
 */
gulp.task('server-scripts', function() {
  return gulp.src(['server/**/*', 'package.json']).pipe(gulp.dest('dist'));
});


/**
 * Task for generating the scripts in development. Has sourcemaps for generated scripts
 */
gulp.task('server-scripts-dev', function() {
  return gulp.src(['server/**/*', 'package.json']).pipe(gulp.dest('build'));
});

/**
 *
 * Scripts tasks
 *
 */
var scriptsErrorHandler = function(err) {
    console.log('[scripts] ', err);
    this.emit('end');
};
gulp.task('client-scripts-dev', function(cb) {
  var webpackConfig = require('./webpack.config');

  // Configure webpack to watch for changes
  webpackConfig.watch = false;
  gulp.src('client/js/app.js')
    .pipe(plumber({
      errorHandler: scriptsErrorHandler
    }))
    // .pipe(named()) // used named for following the naming convention for files
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('build/public/js'));
  cb();
});

gulp.task('client-scripts', function() {
  var webpackConfig = require('./webpack.config');

  // do not use any dev tool (namely the sourcemap tool)
  delete webpackConfig.devtool;

  // configure plugin to uglify js
  webpackConfig.plugins = (webpackConfig.plugins || []).concat([

    new _webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]);

  return gulp.src(['client/js/app.js', 'client/js/vendor.js'])
    .pipe(plumber({
      errorHandler: scriptsErrorHandler
    }))
    // .pipe(named()) // used named for following the naming convention for files
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist/public/js'));
});

/**
 *
 * Html tasks
 *
 */


var htmlErrorHandler = function(err) {
  console.log('[jade] ', err.toString());
};

gulp.task('client-html-dev', function() {
  return gulp.src('client/**/*.jade')
    .pipe(plumber({
      errorHandler: htmlErrorHandler
    }))
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('build/public'));
});

gulp.task('client-html', function() {
  var minifyHtml = require('gulp-minify-html');
  return gulp.src('client/**/*.jade')
    .pipe(plumber({
      errorHandler: htmlErrorHandler
    }))
    .pipe(jade({

    }))
    .pipe(minifyHtml())
    .pipe(gulp.dest('dist/public'));

});

/**
 *
 * Sass/css tasks
 *
 */
var sassErrorHandler = function(err) {
  console.log(err);
  console.log('[sass] ', err.messageFormatted);
  this.emit('end');
};
gulp.task('client-css-dev', function() {
  return gulp.src('client/**/*.scss')
    .pipe(plumber({
      errorHandler: sassErrorHandler
    }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/public'))
    .pipe(browserSync.stream());
});


gulp.task('client-css', function() {
  var minifyCss = require('gulp-minify-css');
  return gulp.src('client/**/*.scss')
    .pipe(plumber({
      errorHandler: sassErrorHandler
    }))
    .pipe(sass())
    // .pipe(minifyCss())
    .pipe(gulp.dest('dist/public'))
});

gulp.task('copy-assets-dev', [], function() {
  return gulp.src('client/assets/**/*')
    .pipe(gulp.dest('build/public/assets'));
});

gulp.task('copy-assets', [], function() {
  return gulp.src('client/assets/**/*')
    .pipe(gulp.dest('dist/public/assets'));
});

gulp.task('start-database', [], function(cb) {
  // make the database directory if it doesn't already exist
  fs.mkdir('./database', function() {
    // run mongod
    child_processes.push();
    var mongodProcess = child_process.spawn('mongod', ['--dbpath=database'], {
      cwd: process.cwd()
    });

    var once = false;
    var mongoDataListener = function(data) {
      // check for textual acknowledgement that the mongo database daemon is
      // started and listening
      if (!once && ~data.toString().indexOf('waiting for connections on port 27017')) {
        cb();
        once = true;
        this.removeListener('data', mongoDataListener);
        console.log('\x1b[92m == Mongo database started and listening on 27017 == ');
      }
    };
    mongodProcess.stdout.on('data', mongoDataListener);

  });

});

gulp.task('server', ['server-scripts-dev', 'start-database'], function(cb) {
  var nodemon = require('gulp-nodemon');
  var once = false;
  return nodemon({
    script: 'build',
    ext: 'js',
    ignore: ['build/public/**/*'],
    watch: 'build',
    stdout: false

  }).on('stdout', function(data) {
    // pass through all standard output
    process.stdout.write(data.toString());
    // perform the callback when the server is ready
    if (!once) {
      cb();
      once = true;
    }
  })
  .on('stderr', function(data) {
    process.stderr.write(data.toString())
  });

});

gulp.task('browser-sync', ['server', 'client-html-dev'], function(cb) {

  // initialize
  browserSync.init({
    proxy: "localhost:3000",
    port: 5000
  });

  // watch for the html changes and reload accordingly
  gulp.watch(['build/public/**/*.js', 'build/public/**/*.html'])
    .on('change', browserSync.reload);
  cb();
  // gulp.watch()
});


gulp.task('watch', ['start-database', 'copy-assets-dev', 'client-html-dev', 'client-css-dev', 'client-scripts-dev', 'server-scripts-dev', 'server', 'browser-sync'], function() {

  var del = require('del');
  var path = require('path');
  var changeHandlerFactory = function(prefix, destPath, ext, outExt) {
    return function(event) {
      if (event.type === 'deleted') {
        // Simulating the {base: 'src'} used with gulp.src in the scripts task
        var filePathFromSrc = path.relative(path.resolve(prefix), event.path);

        // Concatenating the 'build' absolute path used by gulp.dest in the scripts task
        var destFilePath = path.resolve(destPath, filePathFromSrc);
        var indexOfExt = destFilePath.indexOf(ext);
        destFilePath = destFilePath.substring(0, indexOfExt) + outExt;
        fs.unlink(destFilePath, function() {
          console.log('Deleted: ', destFilePath);
        })
      }
    };
  };
  [
    {
      prefix: 'server',
      ext: '.js',
      outExt: '.js',
      suffix: './build/',
      tasks: ['server-scripts-dev']
    },
    {
      prefix: 'client',
      ext: '.jade',
      outExt: '.html',
      suffix: './build/public',
      tasks: ['client-html-dev']
    },
    {
      prefix: 'client',
      ext: '.scss',
      outExt: '.css',
      suffix: './build/public',
      tasks: ['client-css-dev']
    },
    {
      prefix: 'client/assets',
      ext: '',
      outExt: '',
      suffix: './build/public/assets',
      tasks: ['copy-assets']
    }
  ].forEach(function(task) {
    var watcher = gulp.watch(task.prefix + '/**/*' + task.ext, task.tasks);
    watcher.on('change', changeHandlerFactory(task.prefix, task.suffix, task.ext, task.outExt));
  });


  gulp.watch(['client/js/**/*.js'], ['client-scripts-dev']);
});

gulp.task('default', ['clean-build']);

gulp.task('clean', function(cb) {
  var del = require('del');
  return del(['dist'], function(err, paths) {
    if (paths) console.log('Deleted files/folders:\n', paths.join('\n'));
    cb();
  });
});

gulp.task('clean-all', function(cb) {
  var del = require('del');
  return del(['build', 'dist'], function(err, paths) {
    if (paths) console.log('Deleted files/folders:\n', paths.join('\n'));
    cb();
  });
})

gulp.task('clean-build', ['clean'], function() {
  gulp.start('server-scripts', 'client-scripts', 'client-html', 'client-css', 'copy-assets');
});
