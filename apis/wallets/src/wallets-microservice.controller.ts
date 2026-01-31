import { Transaction, Wallet } from '@app/types'
import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { CreateTransactionDto, CreateWalletDto } from './dto'
import { WalletsService } from './wallets.service'

@Controller()
export class WalletsMicroserviceController {
	constructor(private readonly walletsService: WalletsService) {}

	@MessagePattern({ cmd: 'create_wallet' })
	async createWallet(userId: string): Promise<Wallet> {
		const createWalletDto: CreateWalletDto = { userId }
		return this.walletsService.createWallet(createWalletDto)
	}

	@MessagePattern({ cmd: 'charge' })
	async charge(dto: CreateTransactionDto): Promise<Wallet> {
		return this.walletsService.charge(dto.userId, dto.amount)
	}

	@MessagePattern({ cmd: 'request_payment' })
	async requestPayment(
		dto: CreateTransactionDto,
	): Promise<{ transactionId: string; otp: string }> {
		return this.walletsService.requestPayment(dto.userId, dto.amount)
	}
}
