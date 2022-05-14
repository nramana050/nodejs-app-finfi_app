export default {
  head: {
    title: 'Financial Freedom for your Employees',
    titleTemplate: '%s | Finfi',
    meta: [
      { charset: 'utf-8' },
      { hid: 'description', name: 'description', content: 'Finfi: Financial Freedom for your Employees' },
      { hid: 'keywords', name: 'keywords', content: 'finfi' },
      { hid: 'author', name: 'author', content: 'Arunraj Selvam <arunraj@nstore.in' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/png', href: '/finfi.png' }],
  },

  css: [
    '~/assets/style.css',
    '~/node_modules/vue2-datepicker/index.css'
  ],

  plugins: [
    { src: '~/plugins/vue.modal.js' },
    { src: '~/plugins/date.picker', ssr: false },
    { src: '~/plugins/vuex.persist', ssr: false }
  ],

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxtjs/device',
    '@nuxt-hero-icons/outline/nuxt',
    '@nuxt-hero-icons/solid/nuxt'
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/auth-next', 
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@nuxtjs/dayjs',
    '@nuxtjs/toast'
  ],

  components: true,

  axios: {
    baseURL: 'http://0.0.0.0:8000',
  },

  pwa: {
    charset: 'utf-8',
    name: 'Finfi',
    description: 'Finfi: Financial Freedom for your Employees',
    author: 'Arunraj Selvam <arunraj@nstore.in>',
    viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
    icon: {
      fileName: 'finfi.png'
    },
    manifest: {
      lang: 'en',
    },
  },

  build: {
    transpile: ['vue-final-modal']
  },

  server: {
    host: '0.0.0.0',
    port: 8002
  },

  router: {
    mode: 'history',
    trailingSlash: false,
    middleware: ['auth']
  },

  auth: {
    strategies: {
      token: {
        scheme: 'local',
        token: { global: true },
        user: { autoFetch: false, property: false },
        endpoints: {
          login: { url: 'auth/login', method: 'post' },
          user: { url: 'profile', method: 'get' },
          logout: false,
        }
      },
      otp: {
        scheme: 'local',
        token: { global: true },
        user: { autoFetch: false, property: false },
        endpoints: {
          login: { url: 'auth/otp/verify', method: 'post' },
          user: { url: 'profile', method: 'get' },
          logout: false,
        }
      }
    },
  },

  googleFonts: {
    families: {
      Roboto: true
    }
  },

  device: {
    refreshOnResize: true
  },

  toast: {
    position: "bottom-center", 
	  duration : 2500,
    singleton: true,
  }
}
