import { ConfigService } from '@app/shared'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { AppModule } from './app.module'

async function bootstrap() {
	const appContext = await NestFactory.createApplicationContext(AppModule)
	const configService = appContext.get(ConfigService)
	const port = configService.get<number>('MS_NOTIFICATIONS_PORT') ?? 5003
	await appContext.close()

	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AppModule,
		{
			transport: Transport.TCP,
			options: {
				host: '0.0.0.0',
				port,
			},
		},
	)

	await app.listen()

	console.log(`✓ Notifications microservice running on TCP port ${port}`)
}
bootstrap()
