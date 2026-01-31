import {
	CreateTransactionDto as ICreateTransactionDto,
	TransactionType,
} from '@app/types'
import { IsEnum, IsNumber, IsUUID } from 'class-validator'

export class CreateTransactionDto implements ICreateTransactionDto {
	@IsUUID()
	userId!: string

	@IsNumber()
	amount!: number

	@IsEnum(TransactionType)
	type!: TransactionType
}
