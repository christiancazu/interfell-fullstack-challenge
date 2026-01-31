import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialMigration1738262400000 implements MigrationInterface {
	name = 'InitialMigration1738262400000'

	public async up(queryRunner: QueryRunner): Promise<void> {
		// Create wallets table
		await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS wallets (
                user_id varchar(36) NOT NULL,
                balance decimal(10,2) NOT NULL DEFAULT '0.00',
                created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                updated_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (user_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `)

		// Create transactions table
		await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id varchar(36) NOT NULL,
                type enum('charge', 'request_payment', 'send_payment') NOT NULL,
                amount decimal(10,2) NOT NULL,
                status enum('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
                created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                otp varchar(6) NULL,
                finalized_at timestamp NULL,
                wallet_id varchar(36) NOT NULL,
                PRIMARY KEY (id),
                KEY FK_wallet_transaction (wallet_id),
                CONSTRAINT FK_wallet_transaction FOREIGN KEY (wallet_id) REFERENCES wallets (user_id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `)

		// Create indexes
		await queryRunner.query(`
            CREATE INDEX IDX_transactions_wallet_id ON transactions (wallet_id)
        `)

		await queryRunner.query(`
            CREATE INDEX IDX_transactions_status ON transactions (status)
        `)

		await queryRunner.query(`
            CREATE INDEX IDX_transactions_created_at ON transactions (created_at)
        `)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DROP INDEX IDX_transactions_created_at ON transactions`,
		)
		await queryRunner.query(
			`DROP INDEX IDX_transactions_status ON transactions`,
		)
		await queryRunner.query(
			`DROP INDEX IDX_transactions_wallet_id ON transactions`,
		)
		await queryRunner.query(`DROP TABLE IF EXISTS transactions`)
		await queryRunner.query(`DROP TABLE IF EXISTS wallets`)
	}
}
