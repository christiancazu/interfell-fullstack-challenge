import { User } from '@app/types'
import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { SendOtpEmailDto } from './dto/send-otp-email.dto'
import { EmailService } from './services/email.service'

@Controller()
export class AppController {
	constructor(private readonly emailService: EmailService) {}

	@MessagePattern({ cmd: 'send_otp_email' })
	async sendOtpEmail(dto: SendOtpEmailDto): Promise<{ success: boolean }> {
		await this.emailService.sendOtpEmail(dto.user as User, dto.transaction)
		return { success: true }
	}
}
