import { SharedModule } from '@app/shared'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { dataSourceOptions } from './data-source'
import { Transaction, Wallet } from './entities'
import { WalletsService } from './wallets.service'
import { WalletsMicroserviceController } from './wallets-microservice.controller'

@Module({
	imports: [
		SharedModule,
		TypeOrmModule.forRoot(dataSourceOptions),
		TypeOrmModule.forFeature([Wallet, Transaction]),
	],
	controllers: [WalletsMicroserviceController],
	providers: [WalletsService],
})
export class AppModule {}
