import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '../../', '')

	// Extraer el host de VITE_APP_URL si existe
	const allowedHosts = [env.VITE_APP_HOST].filter(Boolean)

	if (env.VITE_APP_URL) {
		try {
			const url = new URL(env.VITE_APP_URL)
			allowedHosts.push(url.hostname)
		} catch (e) {
			console.warn('Invalid VITE_APP_URL:', env.VITE_APP_URL)
		}
	}

	return {
		plugins: [react(), tailwindcss()],
		envDir: '../../',
		server: {
			port: Number(env.VITE_APP_PORT) || 5173,
			host: true,
		},
		preview: {
			port: Number(env.VITE_APP_PORT) || 4173,
			host: true,
			allowedHosts,
		},
	}
})
