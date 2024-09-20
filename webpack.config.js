const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: ['./src/wallet.js', './src/abi.js', './src/config.js'],
  output: {
    filename: 'redbelly-wallet.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'RedbellyWallet',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  mode: 'production',
  target: 'web',
  resolve: {
    fallback: {
      "stream": require.resolve("stream-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "assert": require.resolve("assert/"),
      "buffer": require.resolve("buffer/"),
      "http": false,
      "https": false,
      "os": false
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ]
};