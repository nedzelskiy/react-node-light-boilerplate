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

module.exports = {
  setChunksHashesToManifest,
};
