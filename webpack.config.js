const path = require('path');

module.exports = {
  entry: [
    './src/api.js'
  ],
  output: {
    filename: 'xduce.js',
    library: 'xduce',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [],
  module: {
    loaders: [{
      loader: 'babel-loader',
      include: [
        path.resolve(__dirname, 'src')
      ],
      test: /\.js$/
    }]
  }
};
