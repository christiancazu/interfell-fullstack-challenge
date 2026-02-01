import { ConfigService } from '@app/shared'
import { ConfirmPaymentDto, User } from '@app/types'
import { Injectable } from '@nestjs/common'
import type { Transporter } from 'nodemailer'
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {
	private transporter: Transporter

	constructor(private readonly configService: ConfigService) {
		this.transporter = nodemailer.createTransport({
			host: this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
			port: this.configService.get<number>('SMTP_PORT') || 587,
			secure: false,
			auth: {
				user: this.configService.get<string>('SMTP_USER'),
				pass: this.configService.get<string>('SMTP_PASSWORD'),
			},
		})
	}

	async sendOtpEmail(
		user: User,
		transaction: ConfirmPaymentDto,
	): Promise<void> {
		const mailOptions = {
			from: `"${this.configService.get<string>('SMTP_FROM_NAME') || 'Wallet App'}" <${this.configService.get<string>('SMTP_USER')}>`,
			to: user.email,
			subject: 'Código de verificación para tu pago',
			html: this.getOtpEmailTemplate(user, transaction),
		}

		try {
			await this.transporter.sendMail(mailOptions)
			console.log(`✓ OTP email sent to ${user.email}`)
		} catch (error) {
			console.error(`✗ Failed to send OTP email to ${user.email}:`, error)
			throw error
		}
	}

	private getOtpEmailTemplate(
		user: User,
		transaction: ConfirmPaymentDto,
	): string {
		const confirmPaymentUrl =
			this.configService.get<string>('VITE_CONFIRM_PAYMENT_URL') || '#'
		console.error({ confirmPaymentUrl })
		return `
			<!DOCTYPE html>
			<html lang="es">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Código de verificación</title>
				<style>
					body {
						font-family: Arial, sans-serif;
						line-height: 1.6;
						color: #333;
						max-width: 600px;
						margin: 0 auto;
						padding: 20px;
					}
					.container {
						background-color: #f4f4f4;
						border-radius: 10px;
						padding: 30px;
						text-align: center;
					}
					.otp-code {
						font-size: 32px;
						font-weight: bold;
						color: #2563eb;
						background-color: #fff;
						padding: 20px;
						border-radius: 8px;
						letter-spacing: 5px;
						margin: 20px 0;
					}
					.warning {
						color: #dc2626;
						font-size: 14px;
						margin-top: 20px;
					}
				</style>
			</head>
			<body>
				<div class="container">
					<h1>Código de solicitud de pago</h1>
					${user.name ? `<p>Hola ${user.name},</p>` : '<p>Hola,</p>'}
					<p>Has solicitado realizar un pago. Usa el siguiente código para confirmar la transacción:</p>
					<div class="otp-code">${transaction.otp}</div>
					<a href="${confirmPaymentUrl}?transactionId=${transaction.transactionId}&otp=${transaction.otp}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: #fff; text-decoration: none; border-radius: 5px;">Confirmar Pago</a>
					<div class="warning">
						<strong>Si no realizaste esta solicitud, ignora este correo.</strong>
					</div>
				</div>
			</body>
			</html>
		`
	}
}
