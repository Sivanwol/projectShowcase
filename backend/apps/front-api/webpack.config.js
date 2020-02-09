/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const appPath = './apps/front-api';
module.exports = {
  entry: ['webpack/hot/poll?100', `${appPath}/src/main.ts`],
  watch: true,
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
  mode: 'development',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new TsconfigPathsPlugin({ configFile: `${appPath}/tsconfig.app.json` }),
  ],
  output: {
    path: path.join(__dirname, '../', '../', 'dist', 'apps', 'front-api'),
    filename: 'server.js',
  },
};
