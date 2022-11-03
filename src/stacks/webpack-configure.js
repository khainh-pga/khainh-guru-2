const path = require('path');
const slsw = require('serverless-webpack');

module.exports = (dirname) => ({
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  // entry: slsw.lib.entries,
  devtool: 'inline-source-map',
  entry: path.resolve(dirname, 'handler.ts'),
  output: {
    libraryTarget: 'commonjs2',
    path: path.resolve(dirname, '.webpack'),
    filename: 'handler.js'
  },
  externals: ['aws-sdk'],

  target: 'node',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', 'json'],
    alias: {
      '@common/*': path.resolve(__dirname, '../common/*')
    }
  },
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader' }
    ]
  }
});
