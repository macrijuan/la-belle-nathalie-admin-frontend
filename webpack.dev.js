const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const webpack = require('webpack');

console.log('Loading webpack.dev.js');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'), //where webpack stores the bundle.js file
    filename: 'bundle.js', //the name of the creted file (usually bundle.js)
    publicPath: '/'
  },
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    compress: true,
    port: 8000,
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: './src/index.html', //creates the index.html file
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "buffer": require.resolve("buffer"),
      "stream": require.resolve("stream-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "vm": require.resolve("vm-browserify")
    }
  }
};