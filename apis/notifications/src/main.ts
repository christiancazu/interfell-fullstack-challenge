import { ConfigService } from '@app/shared'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const configService = app.get(ConfigService)
	const port = configService.get<number>('MS_NOTIFICATIONS_PORT') ?? 5003

	await app.listen(port, () => {
		console.log(port, `Notifications service running on port ${port}`)
	})
}
bootstrap()
