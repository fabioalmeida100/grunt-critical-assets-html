'use strict';

var grunt = require('grunt');
var assert = require('assert');

// default options:
var actual = grunt.file.read('tmp/default_options');
var expected = grunt.file.read('test/expected/default_options');
assert.strictEqual(actual, expected, 'Error in the task');
