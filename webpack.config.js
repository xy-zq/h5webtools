let path = require("path"); //内置模块，相对路径解析成绝对路径
let webpack = require("webpack"); // 引用webpack内置插件集合
let CleanWebpackPlugin = require("clean-webpack-plugin"); //打包去除原有的文件夹
let extractPlugin = require('extract-text-webpack-plugin'); // 单独打包css
const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); // 去除注释

module.exports = {
  mode: "production",
  entry: {
    // 入口
    home: "./src/index.js",
  },
  output: {
    filename: "h5webtools.js", // 打包后得文件名
    path: path.resolve(__dirname, "dist"), // 路径必须是绝对路径
    globalObject: "this",
    library: "h5Tools",
    libraryTarget: "umd",
    umdNamedDefine: true,
  },

  plugins: [
    // 打包去除原有的dist
    new CleanWebpackPlugin(["dist"], {
      exclude: ["dll"],
    }),
    new extractPlugin('css/openCamera.css'),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          drop_debugger: true, //去除debugger
          drop_console: true, //去除console
        },
        // 删除注释,默认是false，可以不设置
        output: {
          comments: false
        }
      },
      parallel: true
    })
  ],
  // 模块加载
  module: {
    // noParse: /jquery/, // 不需要解析的插件里面的依赖关系
    // loader 模块加载器
    rules: [
      // js语法转换
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            // 插件库，预设
            presets: [
              "@babel/preset-env", // js es6语法转换
            ],
            plugins: [
              [
                "@babel/plugin-proposal-decorators",
                { legacy: true },
              ], // 语法 @log 装饰器 转换
              "@babel/plugin-proposal-class-properties", // 转换 class   es7语法使用@babel/polyfill,全局require
              "@babel/plugin-transform-runtime", // 可以转换异步得语法，比如promise, 做了简单得优化，比如抽离公共得部分
            ],
          },
        },
        include: path.resolve(__dirname, "src"), // 只在src下找
        // exclude:/node_modules/,             // 排除
      },
      {
        test: /\.css$/, //正则表达式，匹配文件类型
        use: extractPlugin.extract({
          use: ['css-loader'],
          fallback: 'style-loader'
        })
      }
    ],
  },
};
