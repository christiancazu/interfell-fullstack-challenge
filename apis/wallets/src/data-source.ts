import * as fs from 'node:fs'
import * as path from 'node:path'
import * as dotenv from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'

// Load .env (production), fallback to .env.local (development symlink)
// Only load if not already loaded by NestJS
if (!process.env.DB_HOST) {
	const envPath = path.join(__dirname, '../.env')
	const envLocalPath = path.join(__dirname, '../.env.local')

	if (fs.existsSync(envPath)) {
		dotenv.config({ path: envPath })
	} else if (fs.existsSync(envLocalPath)) {
		dotenv.config({ path: envLocalPath })
	}
}

export const dataSourceOptions: DataSourceOptions = {
	type: 'mysql',
	host: process.env.DB_HOST || 'localhost',
	port: Number.parseInt(process.env.DB_PORT || '3306'),
	username: process.env.DB_USERNAME || 'root',
	password: process.env.DB_PASSWORD || '',
	database: process.env.DB_DATABASE_WALLETS || 'wallets',
	entities: [__dirname + '/entities/*.entity{.ts,.js}'],
	migrations: [__dirname + '/migrations/*{.ts,.js}'],
	migrationsTableName: 'migrations',
	logging: process.env.NODE_ENV === 'development',
}

export const AppDataSource = new DataSource(dataSourceOptions)
