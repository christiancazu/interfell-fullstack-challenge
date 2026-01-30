import { UpdateBalanceDto as IUpdateBalanceDto, UpdateType } from '@app/types'
import { Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator'

export class UpdateBalanceDto implements IUpdateBalanceDto {
	@IsNotEmpty()
	@IsUUID()
	userId!: string

	@IsNotEmpty()
	@IsNumber()
	@Type(() => Number)
	amount!: number

	@IsEnum(UpdateType)
	updateType!: UpdateType
}
