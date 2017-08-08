var webpack = require("webpack");
var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
var TransferWebpackPlugin = require("transfer-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");

const { app } = require("./appconfig/settings");

module.exports = {
  entry: {
    app: "./src/js/index.jsx",
    babelPolyfill: "babel-polyfill"
  },
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[id].[chunkhash].js",
    publicPath: "/" + app.contextRoot + "/"
  },
  resolve: {
    alias: {
      "barcsys-dashboard": path.resolve(__dirname, "barcsys-dashboard"),
      "barcsys-components": path.resolve(__dirname, "barcsys-components"),
      appconfig: path.resolve(__dirname, "appconfig")
    },
    extensions: [".ts", ".tsx", ".js", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /(node_modules|bower_components)/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[name]__[local]___[hash:base64:5]"
            }
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
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: function(module) {
        // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.indexOf("node_modules") !== -1;
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest" //But since there are no more common modules between them we end up with just the runtime code included in the manifest file
    }),
    new HtmlWebpackPlugin({
      template: "./src/html/index.html", // Load a custom template
      inject: "body", // Inject all scripts into the body
      title: "新浪INF",
      favicon: "./barcsys-dashboard/images/favicon.ico",
      filename: "index.html",
      chunksSortMode: function(c1, c2) {
        var orders = ["manifest", "vendor", "babelPolyfill", "app"];
        let o1 = orders.indexOf(c1.names[0]);
        let o2 = orders.indexOf(c2.names[0]);
        return o1 - o2;
      }
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: "defer"
    }),
    new webpack.ProvidePlugin({
      Promise: "es6-promise",
      fetch: "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch"
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      }
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": '"production"'
    }),
    new CopyWebpackPlugin([
      {
        from: "node_modules/monaco-editor/min/vs",
        to: "vs"
      }
    ])
  ]
};
