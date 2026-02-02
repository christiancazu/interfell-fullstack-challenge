import type { ConfirmPaymentDto } from '@app/types'
import { useSearch } from '@tanstack/react-router'
import { useActionState, useEffect, useState } from 'react'
import { BackButton } from '../../components/back-button/BackButton'
import httpClient from '../../config/httpClient.config'
import styles from './ConfirmPayment.module.css'

type ConfirmPaymentFormState = {
	success?: boolean
	error?: string
	data?: {
		message: string
	}
}

async function confirmPaymentAction(
	_prevState: ConfirmPaymentFormState | null,
	formData: FormData,
): Promise<ConfirmPaymentFormState> {
	try {
		const transactionId = formData.get('transactionId')
		const otp = formData.get('otp')

		if (!transactionId || !otp) {
			return { error: 'Todos los campos son obligatorios' }
		}

		const requestData: ConfirmPaymentDto = {
			transactionId: transactionId.toString(),
			otp: otp.toString(),
		}

		const response = await httpClient.post<{
			success: boolean
			data: {
				message: string
			}
		}>('wallets/confirm-payment', requestData)

		return {
			success: true,
			data: {
				message: response.data.data.message,
			},
		}
	} catch (error: unknown) {
		const err = error as {
			response?: { data?: { error?: { message?: string } } }
		}
		return {
			error: err.response?.data?.error?.message || 'Error al confirmar pago',
		}
	}
}

export function ConfirmPayment() {
	const search = useSearch({ from: '/layout/confirm-payment' })
	const [state, formAction, isPending] = useActionState<
		ConfirmPaymentFormState | null,
		FormData
	>(confirmPaymentAction, null)

	const [formData, setFormData] = useState<ConfirmPaymentDto>({
		transactionId: '',
		otp: '',
	})

	useEffect(() => {
		// Autocompletar campos desde query params
		const queryTransactionId = (search as any)?.transactionId
		const queryOtp = (search as any)?.otp

		if (queryTransactionId || queryOtp) {
			setFormData({
				transactionId: queryTransactionId || '',
				otp: queryOtp || '',
			})
		}
	}, [search])

	useEffect(() => {
		if (state?.success) {
			setFormData({
				transactionId: '',
				otp: '',
			})
		}
	}, [state?.success])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	// Validar tomando en cuenta tanto el estado actual como los query params
	const queryTransactionId = (search as any)?.transactionId

	const hasTransactionId =
		(formData.transactionId && formData.transactionId.trim().length > 0) ||
		queryTransactionId
	// Usar formData.otp como fuente de verdad una vez autocompletado
	const hasValidOtp =
		formData.otp && formData.otp.toString().trim().length === 6

	const isFormValid = hasTransactionId && hasValidOtp

	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<BackButton />

				<h1 className={styles.title}>Confirmar Pago</h1>

				{state?.error && (
					<div className={styles.errorMessage}>{state.error}</div>
				)}

				{state?.success && state.data && (
					<div className={styles.successMessage}>
						<div className={styles.confirmResult}>
							<div className={styles.successTitle}>
								¡Pago confirmado exitosamente!
							</div>
							<div className={styles.resultMessage}>{state.data.message}</div>
							<div className={styles.successIcon}>
								<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<title>Confirmado</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
						</div>
					</div>
				)}

				<form action={formAction} className={styles.form} autoComplete="off">
					<div className={styles.formGroup}>
						<label htmlFor="transactionId" className={styles.label}>
							ID de Transacción
						</label>
						<input
							type="text"
							id="transactionId"
							name="transactionId"
							value={formData.transactionId}
							onChange={handleChange}
							className={styles.input}
							placeholder="Ingrese el ID de transacción"
							required
							disabled={isPending}
						/>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="otp" className={styles.label}>
							Código OTP
						</label>
						<input
							type="text"
							id="otp"
							name="otp"
							value={formData.otp}
							onChange={handleChange}
							className={styles.input}
							placeholder="000000"
							maxLength={6}
							inputMode="numeric"
							pattern="[0-9]{6}"
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
							{isPending ? 'Confirmando...' : 'Confirmar Pago'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
