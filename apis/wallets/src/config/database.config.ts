import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
	type: 'mysql' as const,
	host: process.env.DB_HOST || 'localhost',
	port: Number.parseInt(process.env.DB_PORT || '3306', 10),
	username: process.env.DB_USERNAME || 'root',
	password: process.env.DB_PASSWORD || '',
	database: process.env.DB_DATABASE_WALLETS || 'wallets',
	logging: process.env.NODE_ENV === 'development',
}))
