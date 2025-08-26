import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [vue(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		host: true,
		strictPort: false,
		watch: {
			// Enable polling to ensure file changes are detected in Docker/WSL/VM/Network drives/Some Windows setups
			usePolling: true,
			interval: 100,
		},
		hmr: {
			overlay: true,
		},
	},
});
