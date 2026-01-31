import { ConfirmPaymentDto as IConfirmPaymentDto } from '@app/types'
import { IsUUID, Length } from 'class-validator'

export class ConfirmPaymentDto implements IConfirmPaymentDto {
	@IsUUID()
	transactionId!: string

	@Length(6)
	otp!: string
}
