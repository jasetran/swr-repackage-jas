const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    regeneratorRuntime: "regenerator-runtime/runtime",
    index: "./src/experiment.js",
    firebaseConfig: "./src/firebaseConfig.js",
    jsPsychPavlovia: "./src/jsPsychPavlovia.js",
    preload: "./src/preload.js",
    introduction: "./src/introduction.js",
    gameBreak: "./src/gameBreak.js",
    config: "./src/config.js",
    audio: "./src/audio.js",
  },
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: {
      keep: /\.git/,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Rapid Online Assessment of Reading - ROAR",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.wav$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "audio",
            },
          },
        ],
      },
      {
        test: /\.csv$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "corpora",
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
