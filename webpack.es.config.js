const config = require('./webpack.config');

config.output.filename = 'xduce.es.js';
config.module.loaders = [];
module.exports = config;
