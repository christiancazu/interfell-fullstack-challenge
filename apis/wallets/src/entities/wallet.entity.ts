import { Wallet as IWallet } from '@app/types'
import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Transaction } from './transaction.entity'

@Entity('wallets')
export class Wallet implements IWallet {
	@PrimaryGeneratedColumn('uuid', { name: 'user_id' })
	userId!: string

	@Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
	balance!: number

	@CreateDateColumn({ name: 'created_at' })
	createdAt!: string

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt!: string

	@OneToMany(
		() => Transaction,
		(transaction) => transaction.wallet,
	)
	transactions!: Transaction[]
}
