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
  const hasScheme = /^[a-z0-9]+:\/\//;

  grunt.registerMultiTask('critical_assets_html', 'Your html simple for WEB', function () {
    var options = this.options({
      jsDir: '',
      cssDir: '',
      ignoreJs: false,
      ignoreCSS: false,
      ignoreImg: false
    });

    var processInput = function (i) { 
      return i; 
    };

    this.files.forEach(function (filePair) {
      if (filePair.src.length === 0) { 
        return; 
      }

      var filePairSrc = filePair.src[0];
      var $ = cheerio.load(grunt.file.read(filePairSrc));
      grunt.log.writeln('Reading files: ' + path.resolve(filePairSrc));

      if (!options.ignoreCSS) {
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
          $(this).replaceWith('<style>' + processInput(grunt.file.read(filePath)) + '</style>');
        });
      }
    
          
      if (!options.ignoreJs) {
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
  
          $(this).replaceWith('<script>' + processInput(grunt.file.read(filePath)) + '</script>');
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
