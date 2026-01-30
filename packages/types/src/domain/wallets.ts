export interface Wallet {
	userId: string
	balance: number
	createdAt: string
	updatedAt: string
}

export enum TransactionType {
	CHARGE = 'charge',
	REQUEST_PAYMENT = 'request_payment',
	SEND_PAYMENT = 'send_payment',
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

export interface TransactionsRepository {
	charge(dto: ChargeWalletDto): Promise<Wallet>
	requestPayment(): Promise<Wallet>
	sendPayment(): Promise<Wallet>
}

export enum UpdateType {
	INCREASE = 'increase',
	DECREASE = 'decrease',
}

export interface UpdateBalanceDto {
	userId: string
	amount: number
	updateType: UpdateType
}

export interface WalletRepository {
	updateBalance(dto: UpdateBalanceDto): Promise<Wallet>
}
