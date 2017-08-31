const path = require('path');

module.exports = {
  entry: ['./src/api.js'],
  output: {
    filename: 'xduce.es.js',
    library: 'xduce',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: []
};
