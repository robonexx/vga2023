const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
  },
  devtool: 'hidden-source-map',
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.png$/,

        use: [
          {
            loader: 'url-loader',
            options: {
              use: [
                {
                  MimeType: 'image/png',
                },
                {
                  MimeType: 'image/webp',
                },
                {
                  MimeType: 'image/svg',
                },
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.svg$/,
        type: 'asset/resource',
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.(svg|png|jpg|jpeg|gif)$/,
        type: 'asset/resource',
      },
    ],
  },
  devServer: {
    static: './src/',
    hot: true,
    open: true,
    port: 8000,
    watchFiles: './src/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
    new Dotenv({
      path: `./.env`,
      systemvars: true,
      prefix: 'process.env.',
      ignoreStub: true,
      allowEmptyValues: true,
    }),
  ],
};
