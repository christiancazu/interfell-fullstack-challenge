import * as fs from 'node:fs'
import * as path from 'node:path'

/**
 * Determina qué archivo .env debe cargarse
 * Prioridad: .env.local > .env
 */
export function getEnvPath(): string {
	const envLocalPath = path.join(__dirname, '../../.env.local')
	const envPath = path.join(__dirname, '../../.env')

	if (fs.existsSync(envLocalPath)) {
		return envLocalPath
	}

	if (fs.existsSync(envPath)) {
		return envPath
	}

	// Si no existe ninguno, retornar .env de todas formas
	// y dejar que NestJS maneje el error si es necesario
	return envPath
}
