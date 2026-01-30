import { SharedModule } from '@app/shared'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { UsersController } from './controllers/users.controller'
import { WalletsController } from './controllers/wallets.controller'
import { httpServiceProvider } from './providers/http-service.provider'

@Module({
	imports: [
		SharedModule,
		HttpModule,
		ClientsModule.registerAsync([
			{
				name: 'WALLETS_SERVICE',
				inject: [ConfigService],
				useFactory: (configService: ConfigService) => ({
					transport: Transport.TCP,
					options: {
						host: configService.get('MS_WALLETS_HOST') || 'localhost',
						port: Number.parseInt(
							configService.get('MS_WALLETS_PORT') || '5002',
							10,
						),
					},
				}),
			},
		]),
	],
	controllers: [UsersController, WalletsController],
	providers: [httpServiceProvider],
})
export class AppModule {}
