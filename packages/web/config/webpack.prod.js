const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const config = require('./webpack.base')

const GLOBALS = {
  'process.env': {
    NODE_ENV: JSON.stringify('production'),
  },
  __USE_MOCK__: JSON.stringify(JSON.parse(process.env.USE_MOCK || 'false')),
}

module.exports = merge(config, {
  mode: 'production',
  entry: {
    app: path.join(__dirname, '../src/index'),
  },
  output: {
    filename: 'statics/js/[name].[chunkhash].js',
    chunkFilename: 'statics/js/[name].[chunkhash].js',
    path: path.resolve(__dirname, '../dist'),
  },
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
  ],
  module: {
    rules: [],
  },
})
