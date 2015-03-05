// Generated on 2014-03-28 using generator-phaser-official 0.0.8-rc-2
'use strict';
var config = require('./config.json'),
    _ = require('underscore'),
    shell = require('shelljs'),
    LIVERELOAD_PORT = 35729,
    lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});

_.str = require('underscore.string');
_.mixin(_.str.exports());

function mountFolder(connect, dir) {
  return connect.static(require('path').resolve(dir));
}

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    manifest: grunt.file.readJSON('manifest.json'),
    watch: {
      scripts: {
        files: [
          '!game/main.js',
          'game/**/*',
          'templates/*.tpl',
          'config.json',
          'css/**/*.css'
        ],
        options: {
          spawn: false,
          livereload: LIVERELOAD_PORT
        },
        tasks: ['build:serve:dev']
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
              mountFolder(connect, 'serve')
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>'
      }
    },
    copy: {
      serve: {
        files: [
          // includes files within path and its sub-directories
          { expand: true, src: ['assets/**', 'fonts/**', 'css/**'], dest: 'serve/' },
          { expand: true, flatten: true, src: [
            'game/plugins/*{.js,.map}',
            'bower_components/*/build/*{.js,.map}',
            'bower_components/*/dist/*{.js,.map}',
            'game/index.html'
          ], dest: 'serve/' }
        ]
      },
      dist: {
        files: [
          // includes files within path and its sub-directories
          { expand: true, src: [
            'assets/**',
            'fonts/**',
            'css/**',
            'icon.png',
            'manifest.json'
          ], dest: 'dist/' },
          { expand: true, flatten: true, src: [
            'game/plugins/*{.min.js,.map}',
            'bower_components/*/build/*{.min.js,.map}',
            'bower_components/*/dist/*{.min.js,.map}',
            'game/index.html'
          ], dest: 'dist/' }
        ]
      },
      dev: {
        options: {
          process: function(content) {
            return grunt.template.process(content, {
              data: {
                dependencies: [
                  'cordova.js',
                  'phaser.js',
                  'phaser-state-transition-plugin.js',
                  'game.js'
                ]
              }
            });
          }
        },
        files: [
          { src: 'game/config/config.dev.json', dest: 'game/config.json' },
          { src: 'templates/_index.html.tpl', dest: 'game/index.html' }
        ]
      },
      prod: {
        options: {
          process: function(content) {
            return grunt.template.process(content, {
              data: {
                dependencies: [
                  'cordova.js',
                  'phaser.min.js',
                  'phaser-state-transition-plugin.min.js',
                  'game.min.js'
                ]
              }
            });
          }
        },
        files: [
          { src: 'game/config/config.prod.json', dest: 'game/config.json' },
          { src: 'templates/_index.html.tpl', dest: 'game/index.html' }
        ]
      }
    },
    browserify: {
      serve: {
        src: ['game/main.js'],
        dest: 'serve/game.js'
      },
      dist: {
        src: ['game/main.js'],
        // dest: 'dist/game.js'
        dest: '.cache/game.js'
      }
    },
    uglify: {
      prod: {
        // comment below to disable
        files: {
          'dist/game.min.js': ['.cache/game.js'],
          'serve/game.min.js': ['.cache/game.js']
        }
      },
      dev: {}
    },
    clean: {
      serve: ['serve'],
      dist: ['dist', 'build'],
    },
    shell: {
      options: {
        stderr: false
      },
      xwalkBuild: {
        command: [
          'python $CROSSWALK_HOME/make_apk.py',
          '--manifest=dist/manifest.json',
          '--package=<%= manifest.package %>',
          '--name=<%= manifest.name %>',
          '--target-dir=build',
          '--mode=' + grunt.option('mode', 'embedded'),
          grunt.option('enable-remote-debugging') ? '--enable-remote-debugging' : '',
          grunt.option('verbose') ? '--verbose' : '',
          // Options for signing the apk for google play
          grunt.option('keystore-path') ? '--keystore-path=' + grunt.option('keystore-path') : '',
          grunt.option('keystore-alias') ? '--keystore-alias=' + grunt.option('keystore-alias') : '',
          grunt.option('keystore-passcode') ? '--keystore-passcode=' + grunt.option('keystore-passcode') : '',
          grunt.option('keystore-alias-passcode') ? '--keystore-alias-passcode=' + grunt.option('keystore-alias-passcode') : '',
          grunt.option('compressor') ? '--compressor' : ''
        ].join(' ')
      },
      xwalkInstallx86: {
        command: 'adb install -r build/*_x86.apk'
      },
      xwalkInstallarm: {
        command: 'adb install -r build/*_arm.apk'
      },
      restartAdb: {
        command: [
          'sudo $(which adb) kill-server',
          'sudo $(which adb) start-server',
          'adb devices'
        ].join('&&')
      },
      cordovaPrepare: {
        command: [
          'rm -rf www',
          'cp -a dist www'
        ].join('&&')
      },
      cordovaSplashIcons: {
        command: [
          'cordova-icon',
          'cordova-splash'
        ].join('&&')
      }
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json', 'manifest.json', 'config.xml'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release %VERSION%',
        commitFiles: ['package.json', 'bower.json', 'manifest.json', 'config.xml'],
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
        'pre-commit': 'jshint jscs',
      }
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

  // Register Grunt Tasks
  grunt.registerTask('default', 'serve');
  grunt.registerTask('buildBootstrapper', function() {
    var stateFiles = grunt.file.expand('game/states/*.js'),
        gameStates = [],
        statePattern = new RegExp(/(\w+).js$/),
        bootstrapper = grunt.file.read('templates/_main.js.tpl');

    stateFiles.forEach(function(file) {
      var state = file.match(statePattern)[1];
      if (!!state) {
        gameStates.push({shortName: state, stateName: _.capitalize(state) + 'State'});
      }
    });
    config.gameStates = gameStates;
    bootstrapper = grunt.template.process(bootstrapper, {data: config});
    grunt.file.write('game/main.js', bootstrapper);
  });
  grunt.registerTask('build', function(dest, environment) {
    grunt.task.run([
      'buildBootstrapper',
      'browserify:' + (dest || 'dist'),
      'copy:' + (environment || 'prod'),
      'copy:' + (dest || 'dist'),
      'uglify:' + (environment || 'prod'),
      'notify_hooks'
    ]);
  });
  grunt.registerTask('serve', function(environment) {
    grunt.task.run([
      'githooks',
      'clean:serve',
      'copy:' + (environment || 'dev'),
      'build:serve:' + (environment || 'dev'),
      'connect:livereload',
      'open',
      'watch'
    ]);
  });
  grunt.registerTask('xwalkBuild', function(environment) {
    grunt.task.run([
      'clean:dist',
      'build:dist:' + (environment || 'prod'),
      'shell:xwalkBuild',
      'notify_hooks'
    ]);
  });
  grunt.registerTask('restartAdb', ['shell:restartAdb']);
  grunt.registerTask('xwalkInstall', function(arch) {
    // arch is x86 (Intel based tablets) or arm (non-Intel)
    grunt.task.run(['shell:xwalkInstall' + (arch || 'arm'), 'notify_hooks']);
  });
  grunt.registerTask('cordovaPlatformsPlugins', function() {
    var pkg = grunt.file.readJSON('package.json');
    if (!pkg.platforms) {
      return grunt.log.error('Platforms not found.');
    }
    if (grunt.option('preserve-platforms')) {
      return grunt.log.writeln('Preserves platforms and plugins');
    }
    _.forEach(pkg.platforms, function (platform) {
      grunt.log.writeln('Installing platform ' + platform);
      shell.exec('cordova platform add ' + platform);
    });
    _.forEach(pkg.plugins, function (plugin) {
      grunt.log.writeln('Installing plugin ' + plugin);
      shell.exec('cordova plugin add ' + plugin);
    });
  });
  grunt.registerTask('cordovaPrepare', function(environment) {
    var tasks = [
      'clean:dist',
      'build:dist:' + (environment || 'prod'),
      'shell:cordovaPrepare',
      'cordovaPlatformsPlugins'
    ];
    if (grunt.option('splashicons')) {
      tasks.push('shell:cordovaSplashIcons');
    }
    grunt.task.run(tasks);
  });
};
