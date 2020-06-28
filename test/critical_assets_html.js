'use strict';

var grunt = require('grunt');
var assert = require('assert');

// default options:
var actual = grunt.file.read('tmp/default_options');
var expected = grunt.file.read('test/expected/default_options');
assert.strictEqual(actual, expected, 'Error with default options compare');

// minifyCSS options:
var actual = grunt.file.read('tmp/minifyCSS_options');
var expected = grunt.file.read('test/expected/minifyCSS_options');
assert.strictEqual(actual, expected, 'Error with minifyCSS options compare');