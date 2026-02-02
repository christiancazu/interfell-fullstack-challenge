import {
	ChargeWalletDto,
	ConfirmPaymentDto,
	CreateTransactionDto,
	TransactionRepository as ITransactionRepository,
	Wallet as IWallet,
	TransactionStatus,
	TransactionType,
} from '@app/types'
import { Injectable, NotFoundException } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { DataSource } from 'typeorm'
import { Transaction, Wallet } from '../entities'

@Injectable()
export class TransactionRepository implements ITransactionRepository {
	constructor(private readonly dataSource: DataSource) {}

	async charge(dto: ChargeWalletDto): Promise<IWallet> {
		const { document: userId, amount } = dto
		return await this.dataSource.transaction(async (manager) => {
			// 1. Buscar wallet con lock para evitar race conditions
			const wallet = await manager.findOne(Wallet, {
				where: { userId },
				lock: { mode: 'pessimistic_write' },
			})

			if (!wallet) {
				throw new NotFoundException(`Billetera no encontrada`)
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

	private generateOTP(): string {
		return Math.floor(100000 + Math.random() * 900000).toString()
	}

	async requestPayment(dto: CreateTransactionDto): Promise<ConfirmPaymentDto> {
		return await this.dataSource.transaction(async (manager) => {
			// 1. Buscar wallet
			const wallet = await manager.findOne(Wallet, {
				where: { userId: dto.userId },
			})

			if (!wallet) {
				throw new RpcException({
					statusCode: 404,
					message: `Billetera ${dto.userId} no encontrada`,
				})
			}

			// 2. Verificar que tenga saldo suficiente
			if (Number(wallet.balance) < dto.amount) {
				throw new RpcException({
					statusCode: 400,
					message: `Saldo insuficiente: actual: ${wallet.balance}, solicitado: ${dto.amount}`,
				})
			}

			// 3. Generar OTP
			const otp = this.generateOTP()

			// 4. Crear transacción con status PENDING
			const transaction = manager.create(Transaction, {
				wallet,
				type: TransactionType.REQUEST_PAYMENT,
				amount: dto.amount,
				status: TransactionStatus.PENDING,
				otp,
			})
			const savedTransaction = await manager.save(transaction)

			// 5. Retornar id y otp
			return {
				transactionId: savedTransaction.id,
				otp,
			}
		})
	}

	async confirmPayment(dto: ConfirmPaymentDto): Promise<IWallet> {
		const { transactionId, otp } = dto
		return await this.dataSource.transaction(async (manager) => {
			// 1. Buscar transacción con lock
			const transaction = await manager.findOne(Transaction, {
				where: { id: transactionId },
				relations: ['wallet'],
				lock: { mode: 'pessimistic_write' },
			})

			if (!transaction) {
				throw new RpcException({
					statusCode: 404,
					message: `Transacción con id ${transactionId} no encontrada`,
				})
			}

			// 2. Verificar OTP
			if (transaction.otp !== otp) {
				throw new RpcException({
					statusCode: 400,
					message: `OTP inválido para la transacción ${transactionId}`,
				})
			}

			// 3. Verificar que la transacción esté PENDING
			if (transaction.status !== TransactionStatus.PENDING) {
				const transactionStatus = TransactionStatus.COMPLETED
					? 'completada'
					: 'fallida'
				throw new RpcException({
					statusCode: 400,
					message: `Transacción ${transactionId} está ${transactionStatus} y no puede ser confirmada`,
				})
			}

			// 4. Verificar que el saldo sea suficiente
			const wallet = transaction.wallet
			if (Number(wallet.balance) < transaction.amount) {
				throw new RpcException({
					statusCode: 400,
					message: `Saldo insuficiente: Actual: ${wallet.balance}, Requerido: ${transaction.amount}`,
				})
			}

			// 5. Actualizar balance de la wallet
			wallet.balance = Number(wallet.balance) - transaction.amount
			await manager.save(wallet)

			// 5. Marcar transacción como COMPLETED y setear finalizedAt
			transaction.status = TransactionStatus.COMPLETED
			transaction.finalizedAt = new Date().toISOString()
			await manager.save(transaction)

			// 6. Retornar wallet actualizado
			return wallet
		})
	}
}
