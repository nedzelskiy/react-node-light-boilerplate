const babelConfig = require('./babelconf').getBabelrcByBrowserQuery('defaults');

require('ignore-styles');
require('@babel/register')(babelConfig);

module.exports = require('./site/server/server');
