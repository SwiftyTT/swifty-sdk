import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './dist/esm/index.js',
  output: {
    filename: 'swifty.min.js',
    path: path.resolve(__dirname, 'dist/umd'),
    library: {
      name: 'Swifty',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'this'
  },
  mode: 'production'
};
