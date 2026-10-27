import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// O proxy faz o front chamar "/api/..." e o Vite repassa para o back-end.
// Assim não precisa escrever "http://localhost:3333" em lugar nenhum do código.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3333',
    },
  },
});
