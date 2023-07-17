/* eslint-disable quote-props */
const path = require('path');
const webpack = require('webpack');
// // eslint-disable-next-line import/no-extraneous-dependencies
const { merge } = require('webpack-merge');
// // eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = {
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
          chunks: 'all',
        },
      },
    },
  },
  resolve: {
    fallback: {
      path: require.resolve("path-browserify")
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]',
        },
      },
      {
        test: /\.mp3$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              outputPath: 'audio',
            },
          },
        ],
      },
      {
        test: /\.mp4$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'video',
            },
          },
        ],
      },
      {
        test: /\.csv$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'corpora',
            },
          },
        ],
      },
    ],
  },
  experiments: {
    topLevelAwait: true,
  },
};

const webConfig = merge(commonConfig, {
  entry: {
    index: path.resolve(__dirname, 'src', 'experiment', 'serve.js'),
  },
  output: {
    filename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: {
      keep: /\.git/,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({ title: 'Rapid Online Assessment of Reading - SWR' }),
  ]
});

const productionConfig = merge(webConfig, {
  mode: 'production',
});

const developmentConfig = merge(webConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
});

const packageConfig = merge(commonConfig, {
  mode: 'production',
  entry: {
    index: path.resolve(__dirname, 'src', 'experiment', 'index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'lib'),
    clean: {
      keep: /\.git/,
    },
    library: {
      // name: 'RoarSWR', // Only valid for type: 'umd'
      type: 'module', // maybe this should be 'umd'
      // umdNamedDefine: true, // uncomment this line if we switch to type: 'umd'
    },
    // globalObject: 'this', // uncomment this if we switch to type: 'umd'
  },
  experiments: {
    outputModule: true,
  },
});

module.exports = async (env, args) => {
  const roarDB = env.dbmode === 'production' ? 'production' : 'development';

  const envDependentConfig = {
    plugins: [
      new webpack.ids.HashedModuleIdsPlugin(), // so that file hashes don't change unexpectedly
      new webpack.DefinePlugin({
        ROAR_DB: JSON.stringify(roarDB),
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
  };

  switch (args.mode) {
    case 'development':
      return merge(developmentConfig, envDependentConfig);
    case 'production':
      return merge(productionConfig, envDependentConfig);
    case 'none':
      return merge(packageConfig, envDependentConfig);
    default:
      throw new Error('No matching configuration was found!');
  }
};
