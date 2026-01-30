import { Wallet } from '@app/types'
import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { WalletsService } from './wallets.service'

@Controller()
export class WalletsMicroserviceController {
	constructor(private readonly walletsService: WalletsService) {}

	@MessagePattern({ cmd: 'create_wallet' })
	async createWallet(userId: string): Promise<Wallet> {
		return this.walletsService.createWallet(userId)
	}

	@MessagePattern({ cmd: 'get_wallet' })
	async getWallet(userId: string): Promise<Wallet> {
		return this.walletsService.findWalletById(userId)
	}

	@MessagePattern({ cmd: 'get_balance' })
	async getBalance(userId: string): Promise<number> {
		return this.walletsService.getBalance(userId)
	}

	@MessagePattern({ cmd: 'update_balance' })
	async updateBalance(data: {
		userId: string
		amount: number
	}): Promise<Wallet> {
		return this.walletsService.updateBalance(data.userId, data.amount)
	}
}
