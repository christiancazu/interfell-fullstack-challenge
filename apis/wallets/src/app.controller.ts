import { ChargeWalletDto, TransactionType, Wallet } from '@app/types'
import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { CreateTransactionDto, CreateWalletDto, UpdateBalanceDto } from './dto'
import { ConfirmPaymentDto } from './dto/confirm-payment'
import { TransactionRepository } from './repositories/transactions.repository'
import { WalletRepository } from './repositories/wallets.repository'

@Controller()
export class AppController {
	constructor(
		private readonly walletRepository: WalletRepository,
		private readonly transactionRepository: TransactionRepository,
	) {}

	@MessagePattern({ cmd: 'create_wallet' })
	async createWallet(userId: string): Promise<Wallet> {
		const createWalletDto: CreateWalletDto = { userId }
		return this.walletRepository.create(createWalletDto)
	}

	@MessagePattern({ cmd: 'charge' })
	async charge(dto: UpdateBalanceDto): Promise<Wallet> {
		return this.transactionRepository.charge(dto)
	}

	@MessagePattern({ cmd: 'request_payment' })
	async requestPayment(dto: CreateTransactionDto): Promise<ConfirmPaymentDto> {
		return this.transactionRepository.requestPayment(dto)
	}

	@MessagePattern({ cmd: 'confirm_payment' })
	async confirmPayment(dto: ConfirmPaymentDto): Promise<Wallet> {
		return this.transactionRepository.confirmPayment(dto)
	}

	@MessagePattern({ cmd: 'get_balance' })
	async getBalance(userId: string): Promise<Wallet> {
		return this.walletRepository.getBalance(userId)
	}
}
