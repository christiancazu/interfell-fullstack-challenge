import config from '@app/shared/config.json'
import type { CheckUserDto } from '@app/types'
import { Link } from '@tanstack/react-router'
import axios from 'axios'
import { useActionState, useEffect, useState } from 'react'
import { PhoneInput } from '../../components/PhoneInput/PhoneInput'
import httpClient from '../../config/httpClient.config'
import styles from './Balance.module.css'

const { FIELDS } = config

interface FormState {
	error?: string
	success?: boolean
	data?: {
		balance: string
		userName: string
	}
}

async function verifyAndGetBalance(
	prevState: FormState | null,
	formData: FormData,
): Promise<FormState> {
	try {
		const countryCode = formData.get('countryCode') as string
		const cellphone = formData.get('cellphone') as string

		const response = await httpClient.post<{
			data: {
				balance: string
				user: {
					name: string
				}
			}
		}>('wallets/get-balance', {
			document: formData.get('document') as string,
			cellphone: `${countryCode}${cellphone}`,
		})

		return {
			success: true,
			data: {
				balance: response.data.data.balance,
				userName: response.data.data.user.name,
			},
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return {
				error:
					error.response?.data?.error?.message || 'Error al verificar usuario',
			}
		}
		return { error: 'Error inesperado al verificar usuario' }
	}
}

export function Balance() {
	const [state, formAction, isPending] = useActionState<
		FormState | null,
		FormData
	>(verifyAndGetBalance, null)
	const [formData, setFormData] = useState<CheckUserDto>({
		document: '',
		cellphone: '',
	})
	const [formKey, setFormKey] = useState(0)

	useEffect(() => {
		if (state?.success) {
			setFormData({
				document: '',
				cellphone: '',
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
		formData.document.length <= FIELDS.DOCUMENT_MAX_LENGTH &&
		formData.cellphone.length > 0 &&
		formData.cellphone.length <= FIELDS.CELLPHONE_MAX_LENGTH

	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<Link to="/" className={styles.backButton}>
					<svg
						className={styles.backIcon}
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<title>Volver</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
					Volver
				</Link>

				<h1 className={styles.title}>Consultar Saldo</h1>

				{state?.error && (
					<div className={styles.errorMessage}>{state.error}</div>
				)}

				{state?.success && state.data && (
					<div className={styles.successMessage}>
						<div className={styles.balanceResult}>
							<div className={styles.userName}>Hola, {state.data.userName}</div>
							<div className={styles.balanceLabel}>Tu saldo disponible es:</div>
							<div className={styles.balanceAmount}>{state.data.balance}</div>
						</div>
					</div>
				)}

				<form action={formAction} className={styles.form} autoComplete="off">
					<div className={styles.formGroup}>
						<label htmlFor="document" className={styles.label}>
							Documento
						</label>
						<input
							id="document"
							name="document"
							type="text"
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
							Teléfono
						</label>
						<PhoneInput
							value={formData.cellphone}
							onChange={handleChange}
							disabled={isPending}
							maxLength={FIELDS.CELLPHONE_MAX_LENGTH}
						/>
					</div>
					<div className={styles.buttonGroup}>
						<button
							type="submit"
							className={`${styles.button} ${styles.buttonPrimary}`}
							disabled={isPending || !isFormValid}
						>
							{isPending ? 'Consultando...' : 'Consultar Saldo'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
