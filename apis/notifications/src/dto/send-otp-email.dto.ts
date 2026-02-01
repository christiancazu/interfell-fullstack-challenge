import { Type } from 'class-transformer'
import {
	IsEmail,
	IsNotEmpty,
	IsNumber,
	IsString,
	ValidateNested,
} from 'class-validator'

class UserDto {
	@IsNumber()
	@IsNotEmpty()
	id: string

	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsString()
	@IsNotEmpty()
	name: string
}

class TransactionDto {
	@IsString()
	@IsNotEmpty()
	transactionId: string

	@IsNumber()
	@IsNotEmpty()
	otp: string
}

export class SendOtpEmailDto {
	@ValidateNested()
	@Type(() => UserDto)
	user: UserDto

	@ValidateNested()
	@Type(() => TransactionDto)
	transaction: TransactionDto
}
