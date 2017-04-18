'use strict';

const GlimmerApp = require('@glimmer/application-pipeline').GlimmerApp;
const Babel = require('broccoli-babel-transpiler');
const babili = require('babel-preset-babili');
const Concat = require('broccoli-concat');
const Rollup = require('broccoli-rollup');
const WebPack = require('./broccoli/webpack-filter');

module.exports = function(defaults) {
  class App extends GlimmerApp {

    _babili() {
      return babili().presets[0];
    }

    // package(tree) {
    //   return new WebPack(tree, {
    //     entry: 'src/index.js',
    //     output: {
    //       filename: 'bundle.js'
    //     }
    //   });
    //   // let babeled = new Babel(tree, Object.assign(this._babili(), {
    //   //   minified: true,
    //   //   comments: false,
    //   // }));

    //   // let rollup = new Rollup(babeled, {
    //   //   inputFiles: ['**/*.js'],
    //   //   rollup: {
    //   //     format: 'umd',
    //   //     entry: 'src/index.js',
    //   //     dest: 'app.js',
    //   //     sourceMap: 'inline'
    //   //   }
    //   // });

    //   // return new Concat(rollup, {
    //   //   outputFile: 'app.js',
    //   //   inputFiles: ['**/*.js']
    //   // });
    // }
  }

  let app = new App(defaults, {
    // 'ember-cli-babel': {
    //   compileModules: false
    // },
    // babel6: {
    //   presets: ['babili'],
    //   loose: true,
    // }
    // Add options here
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
