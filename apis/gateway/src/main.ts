import * as fs from 'node:fs'
import * as path from 'node:path'
import { ConfigService } from '@app/shared'
import { NestFactory } from '@nestjs/core'
import * as dotenv from 'dotenv'
import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './interceptors/global-exception.filter'
import { ResponseTransformInterceptor } from './interceptors/response-transform.interceptor'

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

	app.setGlobalPrefix('api')

	const isDevelopment = process.env.NODE_ENV !== 'production'
	app.enableCors({
		origin: isDevelopment ? '*' : false,
		credentials: true,
	})

	app.useGlobalFilters(new GlobalExceptionFilter())

	// Apply global response transformer
	app.useGlobalInterceptors(new ResponseTransformInterceptor())

	const configService = app.get(ConfigService)
	const port = configService.get<number>('MS_GATEWAY_PORT') ?? 5000

	// Connect to microservices
	await app.init()

	await app.listen(port, () => {
		console.log(`Gateway HTTP service running on port ${port}`)
	})
}
bootstrap()
