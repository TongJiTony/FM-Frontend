const { defineConfig } = require('@vue/cli-service')
const path = require('path');
module.exports = defineConfig({
  // 所有依赖项都被转译
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://www.tonyhuang0908.com:8080', // 后端API的URL,或者使用本地localhost:8080
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/chatAPI': {
        target: 'https://api.stepfun.com',
        changeOrigin: true, // This allows you to avoid the CORS issue
        pathRewrite: { '^/chatAPI': '' }, // This will remove '/chatAPI' from the request URL when sending it to the target
      },
    },
    port: 8082, // 开发服务器的端口号为8082,即localhost:8082
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token'
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
  // Future
})
