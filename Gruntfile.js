/*
 * grunt-assets-inline-html
 * https://github.com/fabioalmeida100/grunt-assets-inline-html.git
 *
 * Copyright (c) 2020 Fábio Almeida
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  grunt.initConfig({    
    clean: {
      tests: ['tmp']
    },       
    critical_assets_html: {
      options: {
        ignoreJs: false,
        ignoreCss: false,
        ignoreImg: false
      },
      all: {
        files: {
            'tmp/default_options': 'test/fixtures/index.html'
          }
      }
    },
    // Run unit tests.
    run: {
      test: {
        cmd: 'node',
        args: ['test/critical_assets_html.js']
      }
    }
  });


  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-run');

  grunt.registerTask('test', ['clean', 'critical_assets_html', 'run']);
};
