const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: process.env.NODE_ENV == "production" ? "./" : "/",
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'HOP SWAP',
    }
  },
  devServer: {
    open: true,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://152.32.210.47:8083",
        pathRewrite: { "^/api": "" },
      },
    },
  },
});
