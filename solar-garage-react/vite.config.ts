import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the app under the repository name, so use that base path
// by default while still allowing an override via VITE_BASE_PATH.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/Solar-Garage/',
});
