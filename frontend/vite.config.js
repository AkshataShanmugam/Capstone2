import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',  // Ensure jsdom is used for React tests
    globals: true,          // Optional: Enables global variables like describe, it, etc.
  },
  server: {
    proxy: {
      '/fetch_data_test': 'http://localhost:8000',
      '/fetch_data': 'http://localhost:8000',
    },
  },
});
