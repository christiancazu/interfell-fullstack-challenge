import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Transaction, Wallet } from './entities'

@Injectable()
export class AppService {
	constructor(
		@InjectRepository(Wallet)
		private readonly walletRepository: Repository<Wallet>,

		@InjectRepository(Transaction)
		private readonly transactionRepository: Repository<Transaction>,
	) {}

	/**
	 * Create a new wallet
	 */
	async createWallet(): Promise<Wallet> {
		const wallet = this.walletRepository.create({
			userId: '550e8400-e29b-41d4-a716-446655440000',
		})
		return this.walletRepository.save(wallet)
	}

	/**
	 * Find wallet by ID
	 */
	async findWalletById(id: string): Promise<Wallet | null> {
		return this.walletRepository.findOne({
			where: { userId: id },
			relations: ['transactions'],
		})
	}

	/**
	 * Get wallet balance
	 */
	async getBalance(walletId: string): Promise<number> {
		const wallet = await this.walletRepository.findOne({
			where: { userId: walletId },
		})
		return wallet?.balance ?? 0
	}

	/**
	 * Update wallet balance
	 */
	async updateBalance(walletId: string, amount: number): Promise<Wallet> {
		const wallet = await this.walletRepository.findOne({
			where: { userId: walletId },
		})

		if (!wallet) {
			throw new Error('Wallet not found')
		}

		wallet.balance = Number(wallet.balance) + amount
		return this.walletRepository.save(wallet)
	}
}
