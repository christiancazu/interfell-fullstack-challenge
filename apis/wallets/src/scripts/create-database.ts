import * as fs from 'node:fs'
import * as path from 'node:path'
import * as dotenv from 'dotenv'
import * as mysql from 'mysql2/promise'

// Load .env (production), fallback to .env.local (development symlink)
const envPath = path.join(__dirname, '../../.env')
const envLocalPath = path.join(__dirname, '../../.env.local')

if (fs.existsSync(envPath)) {
	dotenv.config({ path: envPath })
	console.log('✓ Loaded .env')
} else if (fs.existsSync(envLocalPath)) {
	dotenv.config({ path: envLocalPath })
	console.log('✓ Loaded .env.local (symlink)')
} else {
	console.warn('⚠ No .env or .env.local found, using defaults')
}

async function createDatabaseIfNotExists() {
	const connection = await mysql.createConnection({
		host: process.env.DB_HOST || 'localhost',
		port: Number.parseInt(process.env.DB_PORT || '3306'),
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
