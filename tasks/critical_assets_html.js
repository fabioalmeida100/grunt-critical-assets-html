/*
 * grunt-critical-assets-html
 * 
 *
 * Copyright (c) 2020 Fábio Almeida
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
  'use strict';

  var cheerio = require('cheerio');
  var path = require('path');
  var CleanCSS = require('clean-css');
  const hasScheme = /^[a-z0-9]+:\/\//;
  var UglifyJS = require('uglify-js');
  var processMinifyCSS = null;
  var processMinifyJs = null;

  grunt.registerMultiTask('critical_assets_html', 'Your html simple for WEB', function () {
    var options = this.options({
      jsDir: '',
      cssDir: '',
      ignoreJs: false,
      ignoreCSS: false,
      ignoreImg: false,
      minifyCSS: false,
      minifyJs: false
    });

    initFunctions();

    this.files.forEach(function (filePair) {
      if (filePair.src.length === 0) { 
        return; 
      }

      var filePairSrc = filePair.src[0];
      var $ = cheerio.load(grunt.file.read(filePairSrc));
      grunt.log.writeln('Reading files: ' + path.resolve(filePairSrc));

      if (!options.ignoreCSS) {
        if (options.minifyCSS)
          processMinifyCSS = minifyCSS;

        $('link[rel="stylesheet"]').each(function () {
          var style = $(this).attr('href');
          if (!style) { 
            return; 
          }
          if (style.match(/^\/\//)) { 
            return; 
          }
  
          var attributes = getAttributes(this[0]);
          if (attributes.href) {
            delete attributes.href;
          }
  
          if (attributes.rel) {
            delete attributes.rel;
          }
  
          if (hasScheme.test(style)) {
             return; 
          }
  
          var filePath = 
            (style.substr(0, 1) === '/') ? path.resolve(options.cssDir, style.substr(1)) : path.join(path.dirname(filePairSrc), style);
          grunt.log.writeln(('Including CSS: ').cyan + filePath);
          $(this).replaceWith('<style>' + processMinifyCSS(grunt.file.read(filePath)) + '</style>');
        });
      }
              
      if (!options.ignoreJs) {
        if (options.minifyJs) {

          processMinifyJs = minifyJs; 
        }

        $('script').each(function () {
          var script = $(this).attr('src');
          if (!script) { 
            return; 
          }
          if (script.match(/^\/\//)) { 
            return; 
          }
  
          if (hasScheme.test(script)) {
             return; 
          }
  
          var attributes = getAttributes(this[0]);
          if (attributes.src) {
            delete attributes.src;
          }
  
          var filePath = (script.substr(0, 1) === '/') ? path.resolve(options.jsDir, script.substr(1)) : path.join(path.dirname(filePairSrc), script);
          grunt.log.writeln(('Including JS: ').cyan + filePath);
  
          $(this).replaceWith('<script>' + processMinifyJs(grunt.file.read(filePath)) + '</script>');
        });
      }
               
      if (!options.ignoreImg) {
        $('img').each(function () {
          var src = $(this).attr('src');
          if (!src) { 
            return; 
          }
  
          if (src.match(/^\/\//)) {
             return;            
          }
          if (hasScheme.test(src)) {
             return; 
          }
  
          $(this).attr('src', 'data:image/' + src.substr(src.lastIndexOf('.') + 1) + ';base64,' + Buffer.from(grunt.file.read(path.join(path.dirname(filePairSrc), src), { encoding: null })).toString('base64'));
          grunt.log.writeln('Image in base64:' + src);
        });
      }     

      grunt.file.write(path.resolve(filePair.dest), $.html());
      grunt.log.writeln(('Created ').green + path.resolve(filePair.dest));
    });

    function initFunctions() {
        processMinifyCSS = function (i) { 
          return i; 
        };
    
        processMinifyJs = function (i) { 
          return i; 
        };
    }

    function minifyCSS(css) {
      grunt.log.writeln('Minify CSS in soon...');
      let options = {}; 
      return new CleanCSS(options).minify(css).styles;
    };

    function minifyJs(javascript) {
        grunt.log.writeln('Minify Js in soon...');
        return UglifyJS.minify(javascript).code;      
    }

    function getAttributes (el) {
      var attributes = {};
      for (var index in el.attribs) {
        var attr = el.attribs[index];
        grunt.log.writeln(('attr: ').green + index + ':' + attr);
        attributes[index] = attr;
      }
      return attributes;
    }
  });
};
