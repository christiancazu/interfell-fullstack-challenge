import { registerAs } from '@nestjs/config'

export default registerAs('app', () => ({
	nodeEnv: process.env.NODE_ENV || 'development',
	port: Number.parseInt(process.env.MS_WALLETS_PORT || '5002', 10),
}))
