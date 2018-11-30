/* eslint-disable
  no-param-reassign,
  prefer-destructuring,
  no-restricted-syntax,
  no-extra-boolean-cast,
  no-bitwise
*/

const setChunksHashesToManifest = (compilation, manifest) => {
  try {
    compilation.chunks.forEach((chunk) => {
      const assetName = chunk.name.split('/').pop();
      let jsHash = '';
      let cssHash = '';
      for (const hashKey in chunk.contentHash) {
        if (!!~hashKey.indexOf('mini-css-extract-plugin')) {
          cssHash = chunk.contentHash[hashKey];
        } else if (hashKey === 'javascript') {
          jsHash = chunk.contentHash[hashKey];
        }
      }
      manifest[`${assetName}.js`] = jsHash;
      if (
        assetName !== 'vendors'
        && assetName !== 'common'
      ) {
        manifest[`${assetName}.css`] = cssHash;
      }
    });
    return manifest;
  } catch (err) {
    console.log('moveHashesFromAssetsToManifest error: ', err);
    return manifest;
  }
};

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
  setChunksHashesToManifest,
  WebpackOnBuildPlugin,
};
