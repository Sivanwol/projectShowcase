/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const isProduction =
  typeof process.env.NODE_ENV !== 'undefined' &&
  process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';
const devtool = isProduction ? false : 'inline-source-map';
const appPath = './apps/front-api';
module.exports = {
  entry: ['webpack/hot/poll?100', `${appPath}/src/main.ts`],
  optimization: {
    minimize: false,
  },
  mode,
  devtool,
  target: 'node',
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?100'],
    }),
  ],
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin({ configFile: `${appPath}/tsconfig.app.json` }),
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
    new ForkTsCheckerWebpackPlugin({
      tslint: true,
    }),
    new webpack.DefinePlugin({
      CONFIG: JSON.stringify(require('config')),
    }),
  ],
  output: {
    path: path.join(__dirname, '../', '../', 'dist', 'apps', 'front-api'),
    filename: 'server.js',
  },
};
