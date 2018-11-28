const path = require('path');

class WebpackOnBuildPlugin {
  constructor(options) {
    this.onFinish = options.onFinish;
    this.onStart = options.onStart;
    this.onEmit = options.onEmit;
  }

  apply(compiler) {
    compiler.plugin('done', this.onFinish ? this.onFinish : () => {});
    compiler.plugin('compilation', this.onStart ? this.onStart : () => {});
    compiler.plugin('emit', this.onEmit ? this.onEmit : (compilation, callback) => { return callback(); });
  }
}

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'site/client/client/'),
  },
  plugins: {
    WebpackOnBuildPlugin,
  },
};
