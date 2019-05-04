// @ts-check
const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin').default
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  watch: true,
  entry: {
    background: './src/background',
    contentscript: './src/contentscript',
    preview: './src/preview',
  },
  output: {
    path: path.resolve('./chrome/dist'),
    publicPath: '/dist/',
    filename: '[name].js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['chrome/dist'],
    }),
    new HtmlWebpackPlugin({
      title: 'Octoview',
      filename: 'preview.html',
      chunks: ['preview'],
    }),
  ],
}
