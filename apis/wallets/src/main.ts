import * as fs from 'node:fs'
import * as path from 'node:path'
import { ConfigService } from '@app/shared'
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

	await app.listen()
	console.log(
		`Wallets TCP microservice listening on port ${process.env.MS_WALLETS_PORT || '5002'}`,
	)
}
bootstrap()
