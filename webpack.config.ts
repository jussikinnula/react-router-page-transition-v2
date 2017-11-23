import * as webpack from 'webpack';
import * as path from 'path';

const DefinePlugin = webpack.DefinePlugin;
const LoaderOptionsPlugin = webpack.LoaderOptionsPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NoEmitOnErrorsPlugin = webpack.NoEmitOnErrorsPlugin;
const OccurrenceOrderPlugin = webpack.optimize.OccurrenceOrderPlugin;
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin;

const config = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    modules: ['node_modules']
  },

  // context: path.resolve(__dirname, '../'),

  entry: {
    app: './example/index'
  },

  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  },

  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),

    new LoaderOptionsPlugin({
      debug: true
    }),

    new HtmlWebpackPlugin(),

    new OccurrenceOrderPlugin(true),

    new NoEmitOnErrorsPlugin(),

    new HotModuleReplacementPlugin()
  ],

  module: {
    rules: [
      {
        test: /\.(ts|tsx|jsx)$/,
        exclude: [/\.(spec|e2e|d)\.(ts|tsx|js|jsx)$/],
        loader: 'ts-loader'
      },
      {
        test: /\.styl$/,
        use: [
          { loader: 'style-loader', options: { sourceMap: true } },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'stylus-loader', options: { sourceMap: true } }
        ]
      }
    ]
  },

  devServer: {
    host: 'localhost',
    contentBase: './src',
    hot: true,
    port: 5000,
    stats: {
      cached: true,
      cachedAssets: true,
      chunks: true,
      chunkModules: false,
      colors: true,
      hash: false,
      reasons: true,
      timings: true,
      version: false
    }
  }

};

export default config;
