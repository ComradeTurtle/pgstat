// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxt/ui', 'nuxt-icon'],
  ui: {
    global: true,
    icons: ['mdi', 'heroicons']
  },
  runtimeConfig: {
    public: {
      API_URL: "https://pgapi.comradeturtle.dev"
    }
  }
})
