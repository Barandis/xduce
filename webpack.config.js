const path = require('path');

module.exports = {
  entry: ['./src/api.js'],
  output: {
    filename: 'xduce.js',
    library: 'xduce',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['transform-runtime'],
            presets: ['es2015', 'stage-3']
          }
        },
        include: [path.resolve(__dirname, 'src')]
      }
    ]
  }
};
