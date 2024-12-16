const path = require('path');

module.exports = {
  entry: './dist/esm/index.js',
  output: {
    filename: 'swifty.min.js',
    path: path.resolve(__dirname, 'dist/umd'),
    library: 'Swifty',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  mode: 'production'
};
