module.exports = {
    baseUrl: './',
    productionSourceMap: false,
    devServer: {
        open:true,
        proxy: {
            '/api':{
                target:'http://www.bufantec.com',
                changeOrigin:true,
                pathRewrite:{
                    '^/api':'api'
                }
            },
            '/ms':{
                target: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
                changeOrigin: true
            }
        }
    }
}