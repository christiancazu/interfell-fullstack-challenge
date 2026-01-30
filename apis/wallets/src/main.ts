import * as fs from 'node:fs'
import * as path from 'node:path'
import { ConfigService } from '@app/shared'
import { NestFactory } from '@nestjs/core'
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
	const app = await NestFactory.create(AppModule)

	const configService = app.get(ConfigService)
	const port = configService.get<number>('MS_WALLETS_PORT') ?? 5002

	await app.listen(port, () => {
		console.log(port, `Wallets service running on port ${port}`)
	})
}
bootstrap()
