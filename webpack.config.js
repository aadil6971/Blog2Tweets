const path = require("path");

module.exports = {
  mode: "production",
  entry: { background: "./background.js" },
  output: {
    filename: "[name].bundle.js",
    path: `${path.resolve(__dirname)}/dist`,
    library: { type: "module" },
  },
  target: "webworker",
  experiments: { outputModule: true },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env"] },
        },
      },
    ],
  },
  resolve: { fallback: { fs: false, path: false } },
};
