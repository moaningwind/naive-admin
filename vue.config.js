const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const isPro = process.env.NODE_ENV === 'production'

// cdn
const { jsConfig, externalConfig } = require('./config/cdn')

// gzip
const CompressionPlugin = require('compression-webpack-plugin')
const isGZIP = process.env.VUE_APP_GZIP == 'ON'

const port = process.env.npm_config_port || 4396 // dev port

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: 'warning',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    before: require('./mock/mock-server.js'),
  },
  chainWebpack(config) {
    config.resolve.alias.set('#', resolve('src/views'))

    // html-webpack-plugin
    config.plugin('html').tap(args => {
      args[0].jsConfig = jsConfig
      return args
    })

    config.module.rule('svg').exclude.add(resolve('src/assets/icons')).end()
    // add icons rule use svg-sprite-loader
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()

    config.when(isPro, config => {
      // https://webpack.docschina.org/plugins/split-chunks-plugin
      config.optimization.splitChunks({
        chunks: 'all',
        minSize: 20000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        automaticNameDelimiter: '~',
        cacheGroups: {
          commons: {
            name: 'chunk-commons',
            minChunks: 2,
            priority: 0,
            reuseExistingChunk: true,
          },
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial',
          },
          echarts: {
            name: 'chunk-echarts',
            test: /[\\/]node_modules[\\/](echarts|zrender)[\\/]/,
            priority: 15,
          },
          element: {
            name: 'chunk-element',
            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
            priority: 15,
          },
        },
      })

      // Vue Cli ?????? terser-webpack-plugin ????????????????????????(minimizer)
      // https://github.com/terser/terser#compress-options
      config.optimization.minimizer('terser').tap(args => {
        Object.assign(args[0].terserOptions.compress, {
          // drop_console: true,
          pure_funcs: ['console.log'],
        })
        return args
      })
    })
  },
  configureWebpack() {
    const config = {
      // https://webpack.js.org/configuration/externals/#externals
      externals: externalConfig,
      plugins: [],
    }
    if (isGZIP) {
      config.plugins.push(
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css)$/, // ???????????????
          threshold: 10240, // ?????????10k???????????????
          deleteOriginalAssets: false, // ??????????????????
          minRatio: 0.8, // ?????????
        })
      )
    }
    return config
  },
}
