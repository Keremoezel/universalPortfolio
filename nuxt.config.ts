// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    '@nuxtjs/i18n',
    '@nuxtjs/supabase'
  ],

  supabase: {
    redirect: false
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  googleFonts: {
    families: {
      'Cormorant Garamond': {
        wght: [300, 400, 500, 600],
        ital: [300, 400]
      },
      'DM Sans': {
        wght: [300, 400, 500, 600],
        ital: [300]
      }
    },
    display: 'swap',
    preload: true
  },

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'tr', name: 'Türkçe',  file: 'tr.json' },
      { code: 'de', name: 'Deutsch', file: 'de.json' }
    ],
    langDir: '../i18n/locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },

  routeRules: {
    '/admin/**': { ssr: false }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
