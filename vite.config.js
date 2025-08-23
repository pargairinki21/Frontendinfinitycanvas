// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//    server: {
//     port: 8000
//   },
// })



import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: { port: 8000 },
  resolve: {
    alias: {
      // Redirect tunnel-rat to an empty module
      // 'tunnel-rat': path.resolve(__dirname, 'empty-module.js'),
      '@tailwind': path.resolve(__dirname, 'tailwind.config.cjs'), // optional
    },
  },
});