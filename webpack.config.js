/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: ['./scripts/index.ts'],
  output: {
    path: path.join(__dirname, 'scripts'),
    filename: 'main.bundle.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/i,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: false
            }
          }
        ],
      },
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
  devtool: 'source-map',
}