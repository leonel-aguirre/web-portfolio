const HtmlWebpackPlugin = require("html-webpack-plugin");
const os = require("os");
let ip = os.networkInterfaces()["Wi-Fi"][1]["address"];

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
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.pug",
    }),
  ],
  devServer: {
    host: "192.168.100.136",
  },
};
