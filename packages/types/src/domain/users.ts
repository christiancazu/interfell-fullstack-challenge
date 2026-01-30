export interface User {
	id: string
	document: string
	name: string
	email: string
	cellphone: string
	createdAt: string
	updatedAt: string
}

export interface CreateUserDto {
	document: string
	name: string
	email: string
	cellphone: string
}

export interface VerifyUserDto {
	document: string
	cellphone: string
}

export interface UserRepository {
	create(user: CreateUserDto): Promise<User>
	verify(user: VerifyUserDto): Promise<User | null>
}
