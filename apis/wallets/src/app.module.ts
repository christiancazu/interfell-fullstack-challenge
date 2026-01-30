import { SharedModule } from '@app/shared'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { dataSourceOptions } from './data-source'
import { Transaction, Wallet } from './entities'
import { TransactionRepository } from './transaction.repository'
import { WalletRepository } from './wallet.repository'
import { WalletsService } from './wallets.service'
import { WalletsMicroserviceController } from './wallets-microservice.controller'

@Module({
	imports: [
		SharedModule,
		TypeOrmModule.forRoot(dataSourceOptions),
		TypeOrmModule.forFeature([Wallet, Transaction]),
	],
	controllers: [WalletsMicroserviceController],
	providers: [WalletsService, WalletRepository, TransactionRepository],
})
export class AppModule {}
