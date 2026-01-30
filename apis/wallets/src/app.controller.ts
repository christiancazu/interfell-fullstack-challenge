import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { Wallet } from './entities'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	async createWallet(): Promise<Wallet> {
		return this.appService.createWallet()
	}
}
