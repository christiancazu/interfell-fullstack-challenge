import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import {
	MicroserviceOptions,
	RpcException,
	Transport,
} from '@nestjs/microservices'
import { AppModule } from './app.module'

async function bootstrap() {
	const appContext = await NestFactory.createApplicationContext(AppModule)
	const configService = appContext.get(ConfigService)
	const port = configService.get<number>('app.port')
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

				// Lanzar RpcException con el formato que espera el gateway
				return new RpcException({
					statusCode: 422,
					message: 'Validation failed',
					errors: formattedErrors,
				})
			},
		}),
	)

	await app.listen()

	console.log(
		`Wallets TCP microservice listening on port ${process.env.MS_WALLETS_PORT || '5002'}`,
	)
}
bootstrap()
