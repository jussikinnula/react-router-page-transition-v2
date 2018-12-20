import * as webpack from 'webpack';
import * as path from 'path';

const DefinePlugin = webpack.DefinePlugin;
const LoaderOptionsPlugin = webpack.LoaderOptionsPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NoEmitOnErrorsPlugin = webpack.NoEmitOnErrorsPlugin;
const OccurrenceOrderPlugin = webpack.optimize.OccurrenceOrderPlugin;
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin;

const mode = process.env.NODE_ENV || 'development';

const config = {
  mode,

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    modules: ['node_modules']
  },

  entry: {
    app: './example/src/index'
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './example')
  },

  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),

    new LoaderOptionsPlugin({
      debug: true
    }),

    new HtmlWebpackPlugin({
      chunksSortMode: 'dependency',
      filename: 'index.html',
      hash: true,
      inject: 'body',
      title: 'react-router-page-transition-v2',
      template: './example/src/index.html'
    }),

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

  optimization: {
    minimize: false,
    runtimeChunk: {
      name: 'runtime'
    },
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          minSize: 1
        }
      }
    }
  }
};

export default config;
