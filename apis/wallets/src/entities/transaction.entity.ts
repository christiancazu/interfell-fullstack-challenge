import {
	Transaction as ITransaction,
	TransactionStatus,
	TransactionType,
} from '@app/types'
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { Wallet } from './wallet.entity'

@Entity('transactions')
export class Transaction implements ITransaction {
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@ManyToOne(
		() => Wallet,
		(wallet) => wallet.transactions,
	)
	@JoinColumn({ name: 'wallet_id' })
	wallet!: Wallet

	@Column({
		type: 'enum',
		enum: TransactionType,
	})
	type!: TransactionType

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	amount!: number

	@Column({
		type: 'enum',
		nullable: true,
		enum: TransactionStatus,
	})
	status!: TransactionStatus

	@CreateDateColumn({ name: 'created_at' })
	createdAt!: string

	@Column({ type: 'varchar', length: 6, nullable: true })
	otp?: string | null

	@Column({ name: 'finalized_at', type: 'timestamp', nullable: true })
	finalizedAt?: string | null
}
