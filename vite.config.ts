import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      manifest: {
        name: "tour-go",
        short_name: "tour",
        description: "go go go",
        theme_color: "#242424",
        icons: [
          {
            src: "/react.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "/react.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
      workbox: {
        runtimeCaching: [{
          handler: 'NetworkFirst',
          urlPattern: /\/api\/.*\/*.json/,
          method: 'POST',
          options: {
            backgroundSync: {
              name: 'myQueueName',
              options: {
                maxRetentionTime: 24 * 60
              }
            }
          }
        }]
      }
    }),
  ]
})
