import config from '@app/shared/config.json'
import type { ChargeWalletDto } from '@app/types'
import { Link } from '@tanstack/react-router'
import { useActionState, useEffect, useState } from 'react'
import { BackButton } from '../../components/back-button/BackButton'
import { PhoneInput } from '../../components/phone-input/PhoneInput'
import httpClient from '../../config/httpClient.config'
import styles from './RequestPayment.module.css'

const { FIELDS } = config

type RequestPaymentFormState = {
	success?: boolean
	error?: string
	data?: {
		transactionId: string
		amount: string
	}
}

async function requestPaymentAction(
	_prevState: RequestPaymentFormState | null,
	formData: FormData,
): Promise<RequestPaymentFormState> {
	try {
		const countryCode = formData.get('countryCode')
		const cellphone = formData.get('cellphone')
		const document = formData.get('document')
		const amount = formData.get('amount')

		if (!countryCode || !cellphone || !document || !amount) {
			return { error: 'Todos los campos son obligatorios' }
		}

		const fullCellphone = `${countryCode}${cellphone}`

		const requestData: ChargeWalletDto = {
			document: document.toString(),
			cellphone: fullCellphone,
			amount: Number(amount),
		}

		const response = await httpClient.post<{
			success: boolean
			data: {
				transactionId: string
				otp: string
			}
		}>('wallets/request-payment', requestData)

		return {
			success: true,
			data: {
				transactionId: response.data.data.transactionId,
				amount: requestData.amount.toString(),
			},
		}
	} catch (error: unknown) {
		const err = error as {
			response?: { data?: { error?: { message?: string } } }
		}
		return {
			error: err.response?.data?.error?.message || 'Error al solicitar pago',
		}
	}
}

export function RequestPayment() {
	const [state, formAction, isPending] = useActionState<
		RequestPaymentFormState | null,
		FormData
	>(requestPaymentAction, null)

	const [formData, setFormData] = useState<
		Omit<ChargeWalletDto, 'amount'> & { amount: string }
	>({
		document: '',
		cellphone: '',
		amount: '',
	})

	const [formKey, setFormKey] = useState(0)

	useEffect(() => {
		if (state?.success) {
			setFormData({
				document: '',
				cellphone: '',
				amount: '',
			})
			setFormKey((prev) => prev + 1)
		}
	}, [state?.success])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const isFormValid =
		formData.document.length > 0 &&
		formData.cellphone.length > 0 &&
		formData.amount.length > 0 &&
		Number(formData.amount) > 0

	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<BackButton />

				<h1 className={styles.title}>Solicitar Pago</h1>

				{state?.error && (
					<div className={styles.errorMessage}>{state.error}</div>
				)}

				{state?.success && state.data && (
					<div className={styles.successMessage}>
						<div className={styles.paymentResult}>
							<div className={styles.successTitle}>
								¡Solicitud generada exitosamente!
							</div>
							<div className={styles.resultLabel}>ID de transacción:</div>
							<div
								className={`${styles.resultValue} ${styles.resultValueTransactionId}`}
							>
								{state.data.transactionId}
							</div>
							<div className={styles.resultLabel}>Monto solicitado:</div>
							<div className={styles.resultValue}>
								{parseFloat(state.data.amount).toFixed(2)}
							</div>
							<div className={styles.otpAlert}>
								<svg
									className={styles.otpIcon}
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<title>Correo electrónico</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								<p className={styles.otpMessage}>
									Un código de pago ha sido enviado a su correo, debe usarlo
									para confirmar el pago
								</p>
							</div>
							<Link
								to="/confirm-payment"
								search={{ transactionId: state.data.transactionId }}
								className={`${styles.button} ${styles.buttonConfirm}`}
							>
								Confirmar Pago
							</Link>
						</div>
					</div>
				)}

				<form action={formAction} className={styles.form} autoComplete="off">
					<div className={styles.formGroup}>
						<label htmlFor="document" className={styles.label}>
							Documento
						</label>
						<input
							type="text"
							id="document"
							name="document"
							value={formData.document}
							onChange={handleChange}
							maxLength={FIELDS.DOCUMENT_MAX_LENGTH}
							className={styles.input}
							placeholder="12345678"
							required
							disabled={isPending}
						/>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="cellphone" className={styles.label}>
							Celular
						</label>
						<PhoneInput
							key={formKey}
							value={formData.cellphone}
							onChange={handleChange}
							disabled={isPending}
							maxLength={FIELDS.CELLPHONE_MAX_LENGTH}
						/>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="amount" className={styles.label}>
							Monto a Solicitar
						</label>
						<input
							type="number"
							id="amount"
							name="amount"
							value={formData.amount}
							onChange={handleChange}
							className={styles.input}
							placeholder="0.00"
							step="0.01"
							min="0.01"
							required
							disabled={isPending}
						/>
					</div>

					<div className={styles.buttonGroup}>
						<button
							type="submit"
							className={`${styles.button} ${styles.buttonPrimary}`}
							disabled={!isFormValid || isPending}
						>
							{isPending ? 'Solicitando...' : 'Solicitar Pago'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
