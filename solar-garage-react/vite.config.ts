import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The base path must match your GitHub repo name for Pages to serve assets
// correctly, e.g. if your repo is github.com/you/solar-garage-client-manager
// then base should be '/solar-garage-client-manager/'.
// Set VITE_BASE_PATH as a repo secret/variable, or just hardcode it below.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
});
