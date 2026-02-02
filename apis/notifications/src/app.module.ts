import { SharedModule } from '@app/shared'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { getEnvPath } from './config/env.config'
import { EmailService } from './services/email.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: getEnvPath(),
			isGlobal: true,
		}),
		SharedModule,
	],
	controllers: [AppController],
	providers: [EmailService],
})
export class AppModule {}
