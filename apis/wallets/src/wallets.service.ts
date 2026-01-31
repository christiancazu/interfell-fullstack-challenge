import { Injectable } from '@nestjs/common'
import { CreateWalletDto, UpdateBalanceDto } from './dto'
import { Transaction, Wallet } from './entities'
import { TransactionRepository } from './transaction.repository'
import { WalletRepository } from './wallet.repository'

@Injectable()
export class WalletsService {
	constructor(
		private readonly walletRepository: WalletRepository,
		private readonly transactionRepository: TransactionRepository,
	) {}

	async createWallet(createWalletDto: CreateWalletDto): Promise<Wallet> {
		return this.walletRepository.create(createWalletDto)
	}

	async findWalletById(userId: string): Promise<Wallet> {
		return this.walletRepository.findByUserIdOrFail(userId)
	}

	async getBalance(userId: string): Promise<number> {
		return this.walletRepository.getBalance(userId)
	}

	async updateBalance(updateBalanceDto: UpdateBalanceDto): Promise<Wallet> {
		return this.walletRepository.updateBalance(updateBalanceDto)
	}

	async charge(userId: string, amount: number): Promise<Wallet> {
		return this.transactionRepository.charge(userId, amount)
	}

	async requestPayment(
		userId: string,
		amount: number,
	): Promise<{ transactionId: string; otp: string }> {
		return this.transactionRepository.requestPayment(userId, amount)
	}
}
