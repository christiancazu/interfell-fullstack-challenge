import {
	ChargeWalletDto,
	ConfirmPaymentDto,
	TransactionType,
	User,
	Wallet,
} from '@app/types'
import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { VerifiedUser } from '../decorators/verified-user.decorator'
import { UserExistsGuard } from '../guards/user-exists.guard'

@Controller('wallets')
export class WalletsController {
	constructor(
		@Inject('WALLETS_SERVICE')
		private readonly walletsClient: ClientProxy,

		@Inject('NOTIFICATIONS_SERVICE')
		private readonly notificationsClient: ClientProxy,
	) {}

	@Post('charge')
	@UseGuards(UserExistsGuard)
	async chargeWallet(
		@Body() dto: ChargeWalletDto,
		@VerifiedUser() user: User,
	): Promise<Wallet> {
		return await firstValueFrom(
			this.walletsClient.send<Wallet>(
				{ cmd: 'charge' },
				{
					userId: user.id,
					amount: dto.amount,
				},
			),
		)
	}

	@Post('request-payment')
	@UseGuards(UserExistsGuard)
	async requestPayment(
		@Body() dto: ChargeWalletDto,
		@VerifiedUser() user: User,
	): Promise<ConfirmPaymentDto> {
		const transaction = await firstValueFrom(
			this.walletsClient.send<ConfirmPaymentDto>(
				{ cmd: 'request_payment' },
				{
					userId: user.id,
					amount: Number(dto.amount),
					type: TransactionType.REQUEST_PAYMENT,
				},
			),
		)

		await firstValueFrom(
			this.notificationsClient.send<{ success: boolean }>(
				{ cmd: 'send_otp_email' },
				{
					user,
					transaction,
				},
			),
		)

		return transaction
	}

	@Post('confirm-payment')
	async confirmPayment(
		@Body()
		dto: ConfirmPaymentDto,
	): Promise<Wallet> {
		return await firstValueFrom(
			this.walletsClient.send<Wallet>({ cmd: 'confirm_payment' }, dto),
		)
	}

	@Post('get-balance')
	@UseGuards(UserExistsGuard)
	async getBalance(
		@VerifiedUser() user: User,
	): Promise<Wallet & { user: User }> {
		const wallet = await firstValueFrom(
			this.walletsClient.send<Wallet>({ cmd: 'get_balance' }, user.id),
		)

		return {
			...wallet,
			user,
		}
	}
}
