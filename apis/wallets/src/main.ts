import * as fs from 'node:fs'
import * as path from 'node:path'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import * as dotenv from 'dotenv'
import { AppModule } from './app.module'

// Load .env before anything else
const envPath = path.join(__dirname, '../.env')
const envLocalPath = path.join(__dirname, '../.env.local')

if (fs.existsSync(envPath)) {
	dotenv.config({ path: envPath })
} else if (fs.existsSync(envLocalPath)) {
	dotenv.config({ path: envLocalPath })
}

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AppModule,
		{
			transport: Transport.TCP,
			options: {
				host: '0.0.0.0',
				port: Number.parseInt(process.env.MS_WALLETS_PORT || '5002', 10),
			},
		},
	)

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			exceptionFactory: (errors) => {
				const formattedErrors = errors.reduce(
					(acc, error) => {
						acc[error.property] = Object.values(error.constraints || {})
						return acc
					},
					{} as Record<string, string[]>,
				)

				// Lanzar un error con el formato que espera el gateway
				return {
					statusCode: 422,
					message: 'Validation failed',
					errors: formattedErrors,
				}
			},
		}),
	)

	await app.listen()
	console.log(
		`Wallets TCP microservice listening on port ${process.env.MS_WALLETS_PORT || '5002'}`,
	)
}
bootstrap()
