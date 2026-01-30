export interface Wallet {
	userId: string
	balance: number
	createdAt: string
	updatedAt: string
}

export enum TransactionType {
	CHARGE = 'charge',
	PAYMENT = 'payment',
}

export enum TransactionStatus {
	PENDING = 'pending',
	COMPLETED = 'completed',
	FAILED = 'failed',
}

export interface Transaction {
	id: string
	wallet: Wallet
	type: TransactionType
	amount: number
	status: TransactionStatus
	createdAt: string
	otp?: string | null
	finalizedAt?: string | null
}

export interface ChargeWalletDto {
	document: string
	cellphone: string
	amount: number
}
