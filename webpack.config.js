const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',

  entry: path.resolve(__dirname, './test/demo.js'),

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'demo.js'
  },

  devtool: 'source-map',

  devServer: {
    port: 8000,
    open: true
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html')
    })
  ]
}