import { defineConfig } from 'vite'
import { join } from "path";
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@myHooks': join(__dirname, 'src/hooks'),
      '@myComponents': join(__dirname, 'src/components'),
      '@myCommon': join(__dirname, 'src/common'),
      '@myStore': join(__dirname, 'src/store'),
      '@myTypes': join(__dirname, 'src/types'),
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  plugins: [
    react(),
    VitePWA({
      injectRegister: 'auto',
      manifest: {
        name: "tour-go",
        short_name: "tour",
        description: "go go go",
        theme_color: "#242424",
        background_color: "#242424",
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
          //http://localhost:5173/api/users/self-info
          urlPattern: /\/api\/users\/self-info/,
          method: 'GET',
          options: {
            backgroundSync: {
              name: 'user-info',
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
