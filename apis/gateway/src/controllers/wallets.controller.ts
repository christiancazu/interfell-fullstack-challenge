import {
	ChargeWalletDto,
	ConfirmPaymentDto,
	TransactionType,
	Wallet,
} from '@app/types'
import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { VerifiedUserId } from '../decorators/verified-user-id.decorator'
import { UserExistsGuard } from '../guards/user-exists.guard'

@Controller('wallets')
export class WalletsController {
	constructor(
		@Inject('WALLETS_SERVICE')
		private readonly walletsClient: ClientProxy,
	) {}

	@Post('charge')
	@UseGuards(UserExistsGuard)
	async chargeWallet(
		@Body() dto: ChargeWalletDto,
		@VerifiedUserId() userId: string,
	): Promise<Wallet> {
		return await firstValueFrom(
			this.walletsClient.send<Wallet>(
				{ cmd: 'charge' },
				{
					userId,
					amount: dto.amount,
					type: TransactionType.CHARGE,
				},
			),
		)
	}

	@Post('request-payment')
	@UseGuards(UserExistsGuard)
	async requestPayment(
		@Body() dto: ChargeWalletDto,
		@VerifiedUserId() userId: string,
	): Promise<{ transactionId: string; otp: string }> {
		return await firstValueFrom(
			this.walletsClient.send<{ transactionId: string; otp: string }>(
				{ cmd: 'request_payment' },
				{
					userId,
					amount: dto.amount,
					type: TransactionType.REQUEST_PAYMENT,
				},
			),
		)
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
}
