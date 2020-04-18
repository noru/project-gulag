const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('mini-css-extract-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const extractProjectStyle = new ExtractTextPlugin({
  filename: 'statics/css/[name].[chunkhash].css',
  chunkFilename: 'statics/css/[name].[id].[chunkhash].css',
})

const devMode = process.env.NODE_ENV !== 'production'

const alias = {
  '#': path.resolve(__dirname, '../src'),
}

const GLOBALS = {
  'process.env': {
    VERSION_STRING: JSON.stringify(
      process.env.VERSION_STRING || '(Development)'
    ),
  },
}

module.exports = {
  output: {
    filename: 'statics/js/[name].[chunkhash].js',
    chunkFilename: 'statics/js/[name].[chunkhash].js',
    path: path.resolve(__dirname, '../build'),
  },
  resolve: {
    alias,
    extensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
      '.scss',
      '.css',
      '.sass',
    ],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../tsconfig.json'),
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new HtmlWebpackPlugin({
      template: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),
    // new CopyWebpackPlugin([
    //   {
    //     from: 'src/assets/*',
    //     to: 'statics',
    //   },
    // ]),
    extractProjectStyle,
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: { configFile: 'tsconfig.dev.json' },
          },
        ],
      },
      {
        test: /\.tsx$/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: { configFile: 'tsconfig.dev.json' },
          },
        ],
      },
      // Images
      // Inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.(png|jpg|jpeg|gif|svg|webp)$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: 'statics/imgs/[name].[hash].[ext]',
        },
      },
      // Fonts
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: 'statics/fonts/[name].[ext]?[hash]',
        },
      },
      {
        type: 'javascript/auto',
        test: /\.json$/,
        use: ['raw-loader'],
      },
      {
        test: /\.(css|scss|sass)$/,
        use: [
          devMode ? 'style-loader' : ExtractTextPlugin.loader,
          'css-loader',
          'sass-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'initial',
          enforce: true,
        },
      },
    },
  },
}
