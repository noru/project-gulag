const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('mini-css-extract-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const extractProjectStyle = new ExtractTextPlugin({
  filename: 'assets/css/[name].[chunkhash].css',
  chunkFilename: 'assets/css/[name].[id].[chunkhash].css',
})

const devMode = process.env.NODE_ENV !== 'production'

const alias = {
  '#': path.resolve(__dirname, '../src'),
  assets: path.resolve(__dirname, '../src/assets'),
}

const GLOBALS = {
  'process.env': {
    VERSION_STRING: JSON.stringify(process.env.VERSION_STRING || '(Development)'),
  },
}

module.exports = {
  output: {
    filename: 'assets/js/[name].[chunkhash].js',
    chunkFilename: 'assets/js/[name].[chunkhash].js',
    path: path.resolve(__dirname, '../build'),
  },
  resolve: {
    alias,
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.scss', '.css', '.sass'],
    plugins: [new TsconfigPathsPlugin({ configFile: path.resolve(__dirname, '../tsconfig.json') })]
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
    //     from: 'src/assets',
    //     to: 'assets',
    //   },
    // ]),
    extractProjectStyle,
  ],
  module: {
    rules: [
      // JavaScript / ES6
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, '../src/js'),
        use: 'babel-loader',
      },
      // Images
      // Inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: 'img/[name].[hash].[ext]',
        },
      },
      // Fonts
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: 'fonts/[name].[ext]?[hash]',
        },
      },
      {
        type: 'javascript/auto',
        test: /\.json$/,
        use: [{ loader: 'raw-loader' }],
      },
      {
        test: /\.(css|scss|sass)$/,
        exclude: [/node_modules/, path.resolve(__dirname, '../src/css/3rd.scss')],
        use: [
          devMode ? 'style-loader' : ExtractTextPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]-[hash:base64:5]',
            },
          },
          {
            loader: 'sass-loader',
            query: {
              outputStyle: 'expanded',
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.(css|scss|sass)$/,
        include: [/node_modules/, path.resolve(__dirname, '../src/css/3rd.scss')],
        use: [
          devMode ? 'style-loader' : ExtractTextPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            query: {
              outputStyle: 'expanded',
            },
          },
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