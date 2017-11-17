const environment = require('./environment')
/*const custom = require('./custom')
const merge = require('webpack-merge')

module.exports = merge(environment.toWebpackConfig(), custom)
*/

module.exports = environment.toWebpackConfig();
