const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  context: __dirname,
  entry: {
    app: ["./src/index.js"],
  },
  output: {
    path: __dirname + "\\build",
    filename: "bundle.js",
    publicPath: "/build/",
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ["pug-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.pug",
    }),
  ],
};
