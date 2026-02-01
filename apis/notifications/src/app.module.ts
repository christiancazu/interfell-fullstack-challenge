import { SharedModule } from '@app/shared'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { EmailService } from './services/email.service'

@Module({
	imports: [SharedModule],
	controllers: [AppController],
	providers: [EmailService],
})
export class AppModule {}
