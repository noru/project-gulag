const merge = require('webpack-merge')
const webpack = require('webpack')
const config = require('./webpack.base')
const path = require('path')

const GLOBALS = {
  'process.env': {
    NODE_ENV: JSON.stringify('development'),
  },
  __USE_MOCK__: JSON.stringify(JSON.parse(process.env.USE_MOCK || 'false')),
}

module.exports = merge(config, {
  mode: 'development',
  cache: true,
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack/hot/only-dev-server',
      path.join(__dirname, '../src/index'),
    ],
    vendor: ['react', 'react-dom', 'react-router', 'react-router-dom'],
  },
  output: {
    filename: 'statics/js/[name].js',
    chunkFilename: 'statics/js/[name].js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(GLOBALS),
  ],
  devServer: {
    overlay: true,
    hot: true,
    stats: {
      colors: true,
    },
    contentBase: path.join(__dirname, '../src'),
    watchContentBase: true,
    historyApiFallback: true,
    port: process.env.PORT || 8888,
    disableHostCheck: true,
    proxy: {
      '/api': `http://localhost:${process.env.API_PORT || 80}`,
      '/ws': {
        target: `ws://localhost:${process.env.API_PORT || 80}`,
        ws: true,
      },
    },
  },
  watchOptions: {
    poll: 5000,
    ignored: ['node_modules'],
  },
})
