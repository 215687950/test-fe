module.exports = {
  publicPath: process.env.VUE_APP_BASE_LOC,
  devServer: {
    host: 'test.wpt.la',
    proxy: {
      '/vueApi': {
        target: "http://localhost:8091",
        // target: "http://10.101.60.27:8091/",
        // target: "http://10.101.64.142:8091/",
        changeOrigin: true,
        pathRewrite: {
          '^/vueApi': ''
        }
      },
    }
  }
}