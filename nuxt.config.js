
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Real-Time Earthquakes Map',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Real-Time Earthquakes of the Year' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'https://earthquakes.robertsoriano.com/favicon.ico' },
      { rel: 'image_src', href: 'https://earthquakes.robertsoriano.com/screenshot.jpg' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },
  plugins: [
    '~/plugins/vuetify.js',
    { src: '~/plugins/vue2-google-maps.js', ssr: false },
    '~/plugins/vue2-filters.js',
    '~/plugins/vue-timeago.js'
  ],
  css: [
    '~/assets/style/app.styl'
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#FFFFFF' },
  /*
  ** Build configuration
  */
  build: {
    vendor: [
      '~/plugins/vuetify.js',
      '~/plugins/vue2-google-maps.js',
      '~/plugins/vue2-filters.js',
      '~/plugins/vue-timeago.js',
      'axios',
      'moment'
    ],
    extractCSS: true,
    /*
    ** Run ESLint on save
    */
    extend (config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
    }
  }
}
