import * as dotenv from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'
import { getEnvPath } from './config/env.config'

// Cargar variables de entorno para uso en CLI (migraciones)
dotenv.config({ path: getEnvPath() })

export const dataSourceOptions: DataSourceOptions = {
	type: 'mysql',
	host: process.env.DB_HOST || 'localhost',
	port: Number.parseInt(process.env.DB_PORT || '3306', 10),
	username: process.env.DB_USERNAME || 'root',
	password: process.env.DB_PASSWORD || '',
	database: process.env.DB_DATABASE_WALLETS || 'wallets',
	entities: [`${__dirname}/entities/*.entity{.ts,.js}`],
	migrations: [`${__dirname}/migrations/*{.ts,.js}`],
	migrationsTableName: 'migrations',
	logging: process.env.NODE_ENV === 'development',
}

export const AppDataSource = new DataSource(dataSourceOptions)
