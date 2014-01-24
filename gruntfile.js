module.exports = function(grunt) {

  // karma setup
  var browsers;
  (function() {
    var os = require('os');
    browsers = ['Chrome', 'Firefox', 'Opera'];
    if (os.type() === 'Darwin') {
      browsers.push('ChromeCanary');
      browsers.push('Safari');
    }
    if (os.type() === 'Windows_NT') {
      browsers.push('IE');
    }
  })();

  var banner = '/*\n * jquery-ui-forms v<%= pkg.version %>' +
                ' (<%= grunt.template.today("yyyy-mm-dd") %>)' +
                '\n * Copyright © 2014 Brandon Satrom\n *\n * ' +
                ' Licensed under the MIT License (the "License")\n * you may' +
                ' not use this file except in compliance with the License.\n' +
                ' * You may obtain a copy of the License at\n *' +
                ' http://opensource.org/licenses/MIT\n *\n * Unless' +
                ' required by applicable law or agreed to in writing,' +
                ' software\n * distributed under the License is distributed' +
                ' on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS' +
                ' OF ANY KIND, either express or implied.\n * See the License' +
                ' for the specific language governing permissions and\n *' +
                ' limitations under the License.\n */\n';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
        banner: banner
      },
      dist: {
        src: [
          'src/js/jquery.forms.utils.js',
          'src/js/jquery.forms.features.js',
          'src/js/jquery.forms.types.js',
          'src/js/jquery.forms.js'
        ],
        dest: 'dist/js/jquery.forms.js'
      }
    },
    uglify: {
      options: {
        banner: banner
      },
      dist: {
        files: {
          'dist/js/jquery.forms.min.js': '<%= concat.dist.dest %>'
        }
      }
    },
    cssmin: {
      options: {
        banner: banner
      },
      combine: {
        files: {
          'dist/css/jquery.forms.css': 'src/css/*.css'
        }
      },
      minify: {
        expand: true,
        cwd: 'src/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/',
        ext: '.forms.min.css'
      }
    },
    karma: {
      options: {
        configFile: 'conf/karma.conf.js',
        keepalive: true
      },
      browserstack: {
        browsers: ['BrowserStack:IE:Win']
      },
      forms: {
        browsers: browsers
      }
    },
    jshint: {
      files: ['gruntfile.js', 'src/**/*.js', 'spec/js/*.js'],
      options: {
        jshintrc: '.jshintrc',
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      scripts: {
        files: ['<%= jshint.files %>'],
        tasks: ['minify', 'test', 'notify:watch'],
        options: {
          nospawn: true
        }
      }
    },
    jasmine: {
      src: ['lib/**/*.js', 'dist/js/jquery.forms.min.js'],
      options: {
        specs: 'spec/js/fixtures.js',
        vendor: [
          'spec/lib/jasmine-jquery.js'
        ]
      }
    },
    changelog: {
      options: {
        dest: 'CHANGELOG.md',
        github: 'bsatrom/jquery-ui-forms',
        version: grunt.file.readJSON('package.json').version
      }
    },
    notify: {
      watch: {
        options: {
          title: 'Watch complete',  // optional
          message: 'Minfication and tests have finished running', //required
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['jshint']);
	grunt.registerTask('minify', ['jshint', 'concat',
    'cssmin', 'uglify']);
  grunt.registerTask('x-test', ['minify', 'jasmine', 'karma:forms']);
	grunt.registerTask('test', ['minify', 'jasmine']);
  grunt.registerTask('release', ['x-test', 'changelog']);
};