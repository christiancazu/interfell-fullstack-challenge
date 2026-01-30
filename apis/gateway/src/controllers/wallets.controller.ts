import { Wallet } from '@app/types'
import { Controller, Get, Inject, Param, Post } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

@Controller('wallets')
export class WalletsController {
	constructor(
		@Inject('WALLETS_SERVICE')
		private readonly walletsClient: ClientProxy,
	) {}
}
