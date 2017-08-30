const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, './example/index.tsx'),
  output: {
    path: path.resolve(__dirname, './example'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            rootDir: './'
          }
        }
      }
    ]
  },
  resolve: {
    modules: [
      'node_modules'
    ],
    extensions: ['.js', '.ts', '.tsx']
  },
  devtool: 'inline-source-map',
  context: __dirname,
  devServer: {
    contentBase: path.resolve(__dirname, './example'),
    compress: true,
    port: 9000
  },
  plugins: [
    new HtmlPlugin({
      template: './example/template.html'
    })
  ]
};
