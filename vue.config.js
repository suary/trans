module.exports = {
    publicPath: '/',
    productionSourceMap: false,
    devServer: {
        open: true,
        port: 8080,
        hotOnly: false, 
        proxy: {
            '^/api': {
                target: 'http://localhost:3388/',
                // changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        
    },
};