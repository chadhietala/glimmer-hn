const Filter = require('broccoli-persistent-filter');
const webpack = require('webpack');
const path = require('path');

module.exports = class WebpackFilter extends Filter {
  constructor(inputNode, options) {
    super(inputNode, options);
    this.webpack = null;
    this.options = options;
    this.rewroteEntries = false;
    this.rewroteOutput = false;
  }

  createEntryPaths() {
    if (this.rewroteEntries) { return; }
    if (!this.options.entry) {
      throw new Error('Must provide a string or object of entries.');
    }

    if (typeof this.options.entry === 'string') {
      let entry = path.join(`${this.inputPaths[0]}`, this.options.entry);
      this.options.entry = entry;
      return;
    }

    let entries = {};

    Object.keys(this.options.entry).forEach((entry) => {
      entries[entry] = path.join(`${this.inputPaths[0]}`, this.options.entry[entry]);
    });

    this.options.entry = entries;
    this.rewroteEntries = true;
  }

  createOutputPaths() {
    if (this.rewroteOutput) { return; }
    this.options.output.path =this.outputPath;
    this.rewroteOutput = true;
  }

  build() {
    this.createEntryPaths();
    this.createOutputPaths();
    if (!this.webpack) {
      let options = Object.assign(this.options);
      this.webpack = webpack(options);
    }

    return new Promise((resolve) => {
      this.webpack.run((err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
