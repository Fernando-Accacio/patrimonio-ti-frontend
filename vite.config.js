import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // Simula um navegador invisível na memória
    globals: true, // Permite usar 'describe', 'it', 'expect' sem precisar importar
    setupFiles: './src/setupTests.js', // Arquivo de configuração que criaremos a seguir
  }
})
