export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@pinia/nuxt', // For state management
    '@nuxtjs/tailwindcss', // If using Tailwind CSS
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxt/scripts',
  ],
  ui: {
    icons: ['heroicons', 'material-symbols']
  },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
      laravelBaseUrl: process.env.NUXT_PUBLIC_LARAVEL_BASE_URL || 'http://localhost:8000',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
    }
  },
  // If using Tailwind CSS, you might have a tailwindcss module config here
  // tailwindcss: {
  //   cssPath: '~/assets/css/tailwind.css',
  //   configPath: 'tailwind.config.js',
  //   exposeConfig: false,
  //   injectPosition: 0,
  //   viewer: true,
  // },
  css: ['~/assets/css/main.css'], // For global styles, including Tailwind import
})
