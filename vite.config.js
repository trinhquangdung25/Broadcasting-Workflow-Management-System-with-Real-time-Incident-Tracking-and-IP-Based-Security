import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Giúp định nghĩa dấu @ trỏ thẳng vào thư mục src
    },
  },
  server: {
    port: 5173, // Ép chạy cố định ở cổng 5173
  },
});