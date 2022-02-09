import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  css: ["@/assets/css/fonts.css"],
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      }
    }
  },
  app: {
    buildAssetsDir: '/_nuxt/'
  },
  vite: {
    base: '/_nuxt/'
  },
  nitro: {
    preset: 'lambda'
  }
})
