import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Wallet } from './entities'

@Injectable()
export class WalletsService {
	constructor(
		@InjectRepository(Wallet)
		private readonly walletRepository: Repository<Wallet>,
	) {}

	async createWallet(userId: string): Promise<Wallet> {
		const wallet = this.walletRepository.create({
			userId,
		})
		return this.walletRepository.save(wallet)
	}

	async findWalletById(userId: string): Promise<Wallet> {
		const wallet = await this.walletRepository.findOne({
			where: { userId },
		})

		if (!wallet) {
			throw new NotFoundException(`Wallet with userId ${userId} not found`)
		}

		return wallet
	}

	async getBalance(userId: string): Promise<number> {
		const wallet = await this.findWalletById(userId)
		return wallet.balance
	}

	async updateBalance(userId: string, amount: number): Promise<Wallet> {
		const wallet = await this.findWalletById(userId)
		wallet.balance += amount
		return this.walletRepository.save(wallet)
	}
}
