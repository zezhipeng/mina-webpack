const config = require('../mina-config')
const { resolve } = require('path')
const webpack = require('webpack')
const r = url => resolve(__dirname, url)
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  devtool: false,
  output: {
    path: r('./dist'),
    filename: '[name].js'
  },
  resolve: {
    alias: {
      utils: r('../utils/utils')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            [
              "env", { 
                modules: false 
              }
            ]
          ]
        }
      },
      {
        test: /\.mina$/,
        loader: 'wechat-mina-loader',
        options: {
          path: r('../'),
          dist: './dist'
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: { glob: 'pages/**/*.json' }, 
        to: ''
      }
    ]),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false
    })
  ]
}