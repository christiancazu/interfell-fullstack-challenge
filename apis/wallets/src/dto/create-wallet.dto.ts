import { IsNotEmpty, IsUUID } from 'class-validator'

export class CreateWalletDto {
	@IsNotEmpty()
	@IsUUID()
	userId!: string
}
