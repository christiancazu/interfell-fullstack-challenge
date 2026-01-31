import {
	Wallet as IWallet,
	WalletRepository as IWalletRepository,
	UpdateType,
} from '@app/types'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateWalletDto, UpdateBalanceDto } from '../dto'
import { Wallet } from '../entities'

@Injectable()
export class WalletRepository implements IWalletRepository {
	constructor(
		@InjectRepository(Wallet)
		private readonly repository: Repository<Wallet>,
	) {}

	async create(createWalletDto: CreateWalletDto): Promise<IWallet> {
		const wallet = this.repository.create({
			userId: createWalletDto.userId,
		})
		return this.repository.save(wallet)
	}

	async findByUserId(userId: string): Promise<Wallet | null> {
		return this.repository.findOne({
			where: { userId },
		})
	}

	async findByUserIdOrFail(userId: string): Promise<Wallet> {
		const wallet = await this.findByUserId(userId)

		if (!wallet) {
			throw new NotFoundException(`Wallet with userId ${userId} not found`)
		}

		return wallet
	}

	async updateBalance(updateBalanceDto: UpdateBalanceDto): Promise<IWallet> {
		const wallet = await this.findByUserIdOrFail(updateBalanceDto.userId)
		const amount = Number(updateBalanceDto.amount)

		if (updateBalanceDto.updateType === UpdateType.INCREASE) {
			wallet.balance = Number(wallet.balance) + amount
		} else if (updateBalanceDto.updateType === UpdateType.DECREASE) {
			wallet.balance = Number(wallet.balance) - amount
		}

		return this.repository.save(wallet)
	}

	async getBalance(userId: string): Promise<number> {
		const wallet = await this.findByUserIdOrFail(userId)
		return wallet.balance
	}

	async save(wallet: Wallet): Promise<Wallet> {
		return this.repository.save(wallet)
	}
}
