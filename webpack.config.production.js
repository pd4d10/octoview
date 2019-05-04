const webpack = require('webpack')
const merge = require('webpack-merge')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const config = require('./webpack.config')

module.exports = merge(config, {
  mode: 'production',
  devtool: false,
  watch: false,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new BundleAnalyzerPlugin(),
  ],
})
