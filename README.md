# grunt-critical-assets-html

> Finds all the css/js/image links and put inline in the HTML

## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-critical-assets-html--save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-critical-assets-html');
```

## The "critical_assets_html" task

### Overview
In your project's Gruntfile, add a section named `critical_assets_html` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  critical_assets_html: {
    options: {
      ignoreJs: false,
      ignoreCss: false,
      ignoreImg: false
    },
    all: {
      files: {
          'dist/html-assets-inline': 'test/index.html'
        }
    }
  },
});
```
For register the task use `grunt.registerTask('default', ['critical_assets_html'])`

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
