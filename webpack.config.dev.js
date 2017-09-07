var webpack = require("webpack");
var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
// import { existsSync } from "fs";
var { existsSync } = require("fs");
const pkg = existsSync(path.join("package.json"))
  ? require("./package.json")
  : {};
const getThemeConfig = require(pkg.theme);
let theme = getThemeConfig();

module.exports = {
  devtool: "inline-source-map",
  entry: [
    `webpack-dev-server/client?http://${process.env
      .npm_package_config_host}:${process.env.npm_package_config_port}`, // WebpackDevServer host and port
    "webpack/hot/only-dev-server", // "only" prevents reload on syntax errors
    "babel-polyfill",
    "./src/index.jsx" // Your appʼs entry point
  ],
  output: {
    path: path.join(__dirname, "tmp"),
    filename: "[name].js?[hash]",
    chunkFilename: "[name].[id].js?[hash]",
    publicPath: ""
  },
  resolve: {
    alias: {
      appconfig: path.resolve(__dirname, "appconfig"),
      "redux-arena": path.resolve(__dirname, "arena"),
      "barcsys-dashboard": path.resolve(__dirname, "barcsys-dashboard")
    },
    extensions: [".ts", ".tsx", ".js", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: ["react-hot-loader", "babel-loader"]
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[local]"
            }
          }
        ]
      },
      {
        test: /\.less$/,
        // exclude: /(node_modules|bower_components)/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          },
          {
            loader: "less-loader",
            options: {
              modifyVars: JSON.stringify(theme)
            }
          },
          {
            loader: "postcss-loader"
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              hash: "sha512",
              digest: "hex",
              name: "[hash].[ext]"
            }
          },
          {
            loader: "image-webpack-loader",
            options: {
              query: {
                mozjpeg: {
                  progressive: true
                },
                gifsicle: {
                  interlaced: false
                },
                optipng: {
                  optimizationLevel: 4
                },
                pngquant: {
                  quality: "75-90",
                  speed: 3
                }
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html", // Load a custom template
      inject: "body", // Inject all scripts into the body
      title: "新浪INF",
      // favicon: "./favicon.ico",
      filename: "index.html"
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: "defer"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": '"development"'
    })
  ]
};
