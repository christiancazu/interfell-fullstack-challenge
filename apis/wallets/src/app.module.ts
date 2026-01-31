import { SharedModule } from '@app/shared'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import appConfig from './config/app.config'
import databaseConfig from './config/database.config'
import { getEnvPath } from './config/env.config'
import { Transaction, Wallet } from './entities'
import { TransactionRepository } from './repositories/transactions.repository'
import { WalletRepository } from './repositories/wallets.repository'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: getEnvPath(),
			load: [appConfig, databaseConfig],
			isGlobal: true,
		}),
		SharedModule,
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'mysql',
				host: configService.get('database.host'),
				port: configService.get('database.port'),
				username: configService.get('database.username'),
				password: configService.get('database.password'),
				database: configService.get('database.database'),
				logging: configService.get('database.logging'),
				entities: [Wallet, Transaction],
				migrationsTableName: 'migrations',
			}),
		}),
		TypeOrmModule.forFeature([Wallet, Transaction]),
	],
	controllers: [AppController],
	providers: [WalletRepository, TransactionRepository],
})
export class AppModule {}
