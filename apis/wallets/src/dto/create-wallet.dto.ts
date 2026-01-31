import { CreateWalletDto as ICreateWalletDto } from '@app/types'
import { IsNotEmpty, IsUUID } from 'class-validator'

export class CreateWalletDto implements ICreateWalletDto {
	@IsNotEmpty()
	@IsUUID()
	userId!: string
}
