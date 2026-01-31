import * as dotenv from 'dotenv'
import * as mysql from 'mysql2/promise'
import { getEnvPath } from '../config/env.config'

// Cargar variables de entorno usando la configuración centralizada
const envPath = getEnvPath()
dotenv.config({ path: envPath })

async function createDatabaseIfNotExists() {
	const connection = await mysql.createConnection({
		host: process.env.DB_HOST || 'localhost',
		port: Number.parseInt(process.env.DB_PORT || '3306', 10),
		user: process.env.DB_USERNAME || 'root',
		password: process.env.DB_PASSWORD || '',
	})

	const dbName = process.env.DB_DATABASE_WALLETS || 'wallets'

	try {
		await connection.query(
			`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
		)
		console.log(`✓ Database '${dbName}' is ready`)
	} catch (error) {
		console.error('Error creating database:', error)
		throw error
	} finally {
		await connection.end()
	}
}

createDatabaseIfNotExists()
	.then(() => {
		console.log('Database check completed successfully')
		process.exit(0)
	})
	.catch((error) => {
		console.error('Database check failed:', error)
		process.exit(1)
	})
