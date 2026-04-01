// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@vueuse/nuxt',
    '@primevue/nuxt-module',
    'nuxt-directus',
    '@pinia/nuxt',
  ],
  css: ['~/assets/css/index.css'],
  primevue: {
    importTheme: { from: '@/themes/mytheme.js' },
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  ssr: true,
  // Добавил после предупреждения в терминале
  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit'],
    },
  },
  
  // Блок модуля nuxt-directus
  directus: {
    autoFetch: false, // Отключаем лишние запросы профиля, если не используем логин
  },

  runtimeConfig: {
    // 1. Настройки для сервера (Node.js / Docker) - БЕЗОПАСНО
    directus: {
      url: 'http://directus:8055', 
      token: process.env.DIRECTUS_ADMIN_TOKEN, // Токен живет только на сервере
    },
    // 2. Настройки для браузера (Client) - ПУБЛИЧНО
    public: {
      directus: {
        url: 'http://localhost',
        // УДАЛЯЕМ ОТСЮДА TOKEN! Браузеру он не нужен, если роль Public настроена.
      },
    },
  },
})
