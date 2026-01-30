import { SharedModule } from '@app/shared'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { dataSourceOptions } from './data-source'
import { Transaction, Wallet } from './entities'

@Module({
	imports: [
		SharedModule,
		TypeOrmModule.forRoot(dataSourceOptions),
		TypeOrmModule.forFeature([Wallet, Transaction]),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
