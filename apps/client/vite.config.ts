import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '../../', '')
	return {
		plugins: [react(), tailwindcss()],
		envDir: '../../',
		server: {
			port: Number(env.VITE_APP_PORT) || 5173,
		},
	}
})

