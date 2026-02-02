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

export interface CreateWalletDto {
	userId: string
}

export interface CheckUserDto {
	document: string
	cellphone: string
}

export interface ChargeWalletDto {
	document: string
	cellphone: string
	amount: number
}

export interface ConfirmPaymentDto {
	transactionId: string
	otp: string
}

export enum UpdateType {
	INCREASE = 'increase',
	DECREASE = 'decrease',
}

export interface UpdateBalanceDto {
	userId: string
	amount: number
	updateType?: UpdateType
}

export interface CreateTransactionDto {
	userId: string
	amount: number
	type: TransactionType
}

export interface WalletRepository {
	create(dto: CreateWalletDto): Promise<Wallet>
	updateBalance(dto: UpdateBalanceDto): Promise<Wallet>
	getBalance(userId: string): Promise<Wallet>
}

export interface TransactionRepository {
	charge(dto: UpdateBalanceDto): Promise<Wallet>
	requestPayment(dto: CreateTransactionDto): Promise<ConfirmPaymentDto>
	confirmPayment(dto: ConfirmPaymentDto): Promise<Wallet>
}
