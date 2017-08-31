const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

const banner = fs.readFileSync(path.resolve(__dirname, 'LICENSE'), 'utf8');

module.exports = {
  entry: ['./src/api.js'],
  output: {
    filename: 'xduce.es.min.js',
    library: 'xduce',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [new webpack.BannerPlugin({ banner, entryOnly: true })],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['minify']
          }
        },
        include: [path.resolve(__dirname, 'src')]
      }
    ]
  }
};
