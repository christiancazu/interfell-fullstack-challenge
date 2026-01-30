import { TransactionType } from '@app/types'
import { IsEnum, IsNumber, IsUUID } from 'class-validator'

export class CreateTransactionDto {
	@IsUUID()
	userId!: string

	@IsNumber()
	amount!: number

	@IsEnum(TransactionType)
	type!: TransactionType
}
