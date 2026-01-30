import { CreateUserDto, User, VerifyUserDto, Wallet } from '@app/types'
import { HttpService } from '@nestjs/axios'
import { Body, Controller, Inject, Post } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

@Controller('users')
export class UsersController {
	constructor(
		private readonly httpService: HttpService,
		@Inject('WALLETS_SERVICE')
		private readonly walletsClient: ClientProxy,
	) {}

	@Post()
	async createUser(@Body() data: CreateUserDto): Promise<User> {
		// Crear usuario en el microservicio de users
		const response = await firstValueFrom(
			this.httpService.post<User>('/', data),
		)
		const user = response.data

		// Crear wallet para el usuario
		await firstValueFrom(
			this.walletsClient.send<Wallet>({ cmd: 'create_wallet' }, user.id),
		)

		return user
	}

	@Post('verify')
	async verifyUser(@Body() data: VerifyUserDto): Promise<User> {
		const response = await firstValueFrom(
			this.httpService.post<User>('/verify', data),
		)
		return response.data
	}
}
