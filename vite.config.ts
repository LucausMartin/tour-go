import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'My PWA',
        short_name: 'MyApp',
        description: 'My PWA',
        theme_color: '#242424',
        icons: [
          {
            src: './react.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: './react.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      },
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      }
    }),
  ]
})
