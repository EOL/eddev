const { environment } = require('@rails/webpacker');
const merge = require('webpack-merge')

/* This is horrible but taken straight from rails/webpacker docs. */
const myCssLoaderOptions = {
  modules: true,
  sourceMap: true,
  localIdentName: '[name]__[local]__[hash:base64:5]'
}

const CSSLoader = environment.loaders.get('style').use.find(el => el.loader === 'css-loader')

CSSLoader.options = merge(CSSLoader.options, myCssLoaderOptions)

module.exports = environment;
