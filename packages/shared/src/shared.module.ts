import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedService } from './shared.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ['.env', '.env.local'],
			isGlobal: true,
		}),
	],
	providers: [SharedService],
	exports: [SharedService, ConfigModule],
})
export class SharedModule {}
