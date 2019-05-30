const { environment } = require('@rails/webpacker');
const merge = require('webpack-merge')

// resolve-url-loader must be used before sass-loader

environment.loaders.get('sass').use.splice(-1, 0, {
  loader: 'resolve-url-loader'
});


/* This is horrible but taken straight from rails/webpacker docs. */
const myCssLoaderOptions = {
  modules: true,
  sourceMap: true,
  localIdentName: '[name]__[local]__[hash:base64:5]'
}

const CSSLoader = environment.loaders.get('sass').use.find(el => el.loader === 'css-loader')

CSSLoader.options = merge(CSSLoader.options, myCssLoaderOptions)

module.exports = environment;
