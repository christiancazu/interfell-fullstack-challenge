import * as fs from 'node:fs'
import * as path from 'node:path'

/**
 * Determina qué archivo .env debe cargarse
 * Prioridad: .env (root) > .env.local
 */
export function getEnvPath(): string {
	const rootEnvPath = path.resolve(__dirname, '../../../../.env')
	const envLocalPath = path.resolve(__dirname, '../../.env.local')

	console.log('Checking .env paths:')
	console.log(
		'Root .env path:',
		rootEnvPath,
		'exists:',
		fs.existsSync(rootEnvPath),
	)
	console.log(
		'Local .env path:',
		envLocalPath,
		'exists:',
		fs.existsSync(envLocalPath),
	)

	if (fs.existsSync(rootEnvPath)) {
		console.log('Using root .env')
		return rootEnvPath
	}

	if (fs.existsSync(envLocalPath)) {
		console.log('Using local .env')
		return envLocalPath
	}

	// Si no existe ninguno, retornar .env de todas formas
	// y dejar que NestJS maneje el error si es necesario
	return rootEnvPath
}
