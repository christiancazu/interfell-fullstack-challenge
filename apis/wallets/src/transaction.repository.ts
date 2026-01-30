import { TransactionStatus, TransactionType } from '@app/types'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { Transaction, Wallet } from './entities'

@Injectable()
export class TransactionRepository {
	constructor(
		@InjectRepository(Transaction)
		private readonly repository: Repository<Transaction>,
		private readonly dataSource: DataSource,
	) {}

	async charge(userId: string, amount: number): Promise<Wallet> {
		return await this.dataSource.transaction(async (manager) => {
			// 1. Buscar wallet con lock para evitar race conditions
			const wallet = await manager.findOne(Wallet, {
				where: { userId },
				lock: { mode: 'pessimistic_write' },
			})

			if (!wallet) {
				throw new NotFoundException(`Wallet with userId ${userId} not found`)
			}

			// 2. Crear transacción con status PENDING
			const transaction = manager.create(Transaction, {
				wallet,
				type: TransactionType.CHARGE,
				amount,
				status: TransactionStatus.PENDING,
			})
			await manager.save(transaction)

			// 3. Actualizar balance de la wallet
			wallet.balance = Number(wallet.balance) + amount
			await manager.save(wallet)

			// 4. Marcar transacción como COMPLETED y setear finalizedAt
			transaction.status = TransactionStatus.COMPLETED
			transaction.finalizedAt = new Date().toISOString()
			await manager.save(transaction)

			// 5. Retornar wallet actualizado
			return wallet
		})
	}
}
