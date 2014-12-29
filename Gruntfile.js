// Generated on 2014-03-28 using generator-phaser-official 0.0.8-rc-2
'use strict';
var config = require('./config.json');
var _ = require('underscore');
_.str = require('underscore.string');

// Mix in non-conflict functions to Underscore namespace if you want
_.mixin(_.str.exports());

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    manifest: grunt.file.readJSON('manifest.json'),
    watch: {
      scripts: {
        files: [
          'game/**/*.js',
          '!game/main.js',
          'templates/*.js.tpl',
          'config.json',
          'css/**/*.css',
          'index.html'
        ],
        options: {
          spawn: false,
          livereload: LIVERELOAD_PORT
        },
        tasks: ['build']
      }
    },
    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, 'dist')
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:9000'
      }
    },
    copy: {
      dist: {
        files: [
          // includes files within path and its sub-directories
          { expand: true, src: ['assets/**'], dest: 'dist/' },
          { expand: true, src: ['fonts/**'], dest: 'dist/' },
          { expand: true, src: ['css/**'], dest: 'dist/' },
          { expand: true, flatten: true, src: ['game/plugins/*{.js,.map}'], dest: 'dist/' },
          { expand: true, flatten: true, src: [
              'bower_components/*/build/*.js',
              'bower_components/*/dist/*.js'
            ], dest: 'dist/' },
          { expand: true, src: ['icon.png'], dest: 'dist/' },
          { expand: true, src: ['manifest.json'], dest: 'dist/' },
          { expand: true, src: ['index.html'], dest: 'dist/' }
        ]
      },
      dev: {
        files: [
          { src: 'game/config/config.dev.json', dest: 'game/config.json' }
        ]
      },
      prod: {
        files: [
          { src: 'game/config/config.prod.json', dest: 'game/config.json' }
        ]
      }
    },
    browserify: {
      build: {
        src: ['game/main.js'],
        dest: 'dist/game.js'
      }
    },
    shell: {
      options: {
        stderr: false
      },
      buildAndroid: {
        command: "./build_android.sh <%= manifest.package %> <%= manifest.name %> <%= manifest.version %>"
      },
      installAndroidx86: {
        command: "adb install -r build/*_x86.apk"
      },
      installAndroidarm: {
        command: "adb install -r build/*_arm.apk"
      },
      restartAdb: {
        command: [
          'sudo $(which adb) kill-server',
          'sudo $(which adb) start-server',
          'adb devices'
        ].join('&&')
      }
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json', 'manifest.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release %VERSION%',
        commitFiles: ['package.json', 'bower.json', 'manifest.json'],
        createTag: false,
        tagName: '%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
      }
    },
    jshint: {
      all: ['game/**/*.js', 'Gruntfile.js'],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },
    jscs: {
      src: [
        'game/**/*.js',
        '!game/main.js',
        '!game/plugins/*'
      ],
      options: {
        config: '.jscsrc',
        reporter: require('jscs-stylish').path
      }
    },
    githooks: {
      all: {
        // Will run the jshint and test:unit tasks at every commit
        'pre-commit': 'checkStyle',
      }
    },
    clean: {
      serve: ['dist'],
      build: ['dist', 'build'],
    },
    'notify_hooks': {
      options: {
        enabled: true,
        'max_jshint_notifications': 5, // maximum number of notifications from jshint output
        success: true, // whether successful grunt executions should be notified automatically
        duration: 3 // the duration of notification in seconds, for `notify-send only
      }
    },
  });

  grunt.registerTask('default', 'serve');
  grunt.registerTask('build', ['buildBootstrapper', 'browserify', 'copy:dist', 'notify_hooks']);
  grunt.registerTask('serve', function(env) {
    grunt.task.run(['githooks', 'clean:serve', 'copy:' + (env || 'dev'), 'build', 'connect:livereload', 'open', 'watch']);
  });
  grunt.registerTask('buildAndroid', function(env) {
    grunt.task.run(['clean:build', 'copy:' + (env || 'prod'), 'build', 'shell:buildAndroid', 'notify_hooks']);
  });
  grunt.registerTask('restartAdb', ['shell:restartAdb']);
  grunt.registerTask('installAndroid', function(arch) {
    // arch is x86 (Intel based tablets) or arm (non-Intel)
    grunt.task.run(['shell:installAndroid' + (arch || 'arm'), 'notify_hooks']);
  });
  grunt.registerTask('buildBootstrapper', 'builds the bootstrapper file correctly', function() {
    var stateFiles = grunt.file.expand('game/states/*.js');
    var gameStates = [];
    var statePattern = new RegExp(/(\w+).js$/);
    stateFiles.forEach(function(file) {
      var state = file.match(statePattern)[1];
      if (!!state) {
        gameStates.push({shortName: state, stateName: _.capitalize(state) + 'State'});
      }
    });
    config.gameStates = gameStates;
    console.log(config);
    var bootstrapper = grunt.file.read('templates/_main.js.tpl');
    bootstrapper = grunt.template.process(bootstrapper,{data: config});
    grunt.file.write('game/main.js', bootstrapper);
  });
  grunt.registerTask('checkStyle', ['jshint', 'notify_hooks', 'jscs', 'notify_hooks']);
};
