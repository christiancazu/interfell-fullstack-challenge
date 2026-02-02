import { useActionState, useState, useEffect } from 'react'
import axios from 'axios'
import { customList } from 'country-codes-list'
import config from '@app/shared/config.json'
import styles from './Register.module.css'
import type { CreateUserDto } from '@app/types'
import { Link } from '@tanstack/react-router'
import httpClient from '../../config/httpClient.config'

const countryCodes = customList('countryCode' as any, '+{countryCallingCode}')
const { FIELDS } = config

function getFlagEmoji(countryCode: string): string {
	const codePoints = countryCode
		.toUpperCase()
		.split('')
		.map(char => 127397 + char.charCodeAt(0))
	return String.fromCodePoint(...codePoints)
}

async function getCountryByIP(): Promise<string> {
	try {
		const response = await fetch('https://ipapi.co/json/')
		const data = await response.json()
		const countryCode = data.country_code
		return countryCodes[countryCode] || '+51'
	} catch {
		return '+51'
	}
}

interface FormState {
	error?: string
	success?: boolean
	data?: any
}
	
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function registerUser(
	prevState: FormState | null,
	formData: FormData
): Promise<FormState> {
	try {
		const countryCode = formData.get('countryCode') as string
		const cellphone = formData.get('cellphone') as string

		const response = await httpClient.post<CreateUserDto>('users', {
			document: formData.get('document') as string,
			name: formData.get('name') as string,
			email: formData.get('email') as string,
			cellphone: `${countryCode}${cellphone}`,
		})

		return { success: true, data: response.data }
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return { error: error.response?.data?.message || 'Error al registrar usuario' }
		}
		return { error: 'Error inesperado al registrar usuario' }
	}
}

export function Register() {
	const [state, formAction, isPending] = useActionState<FormState | null, FormData>(
		registerUser,
		null
	)
	const [defaultCountryCode, setDefaultCountryCode] = useState('+51')
	const [formData, setFormData] = useState<CreateUserDto>({
		document: '',
		name: '',
		email: '',
		cellphone: '',
	})

	useEffect(() => {
		getCountryByIP().then(code => setDefaultCountryCode(code))
	}, [])

	useEffect(() => {
		if (state?.success) {
			setFormData({
				document: '',
				name: '',
				email: '',
				cellphone: '',
			})
		}
	}, [state?.success])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value,
		}))
	}

	
	const isFormValid = 
		formData.document.length > 0 &&
		formData.document.length <= FIELDS.DOCUMENT_MAX_LENGTH &&
		formData.name.length > 0 &&
		formData.name.length <= FIELDS.NAME_MAX_LENGTH &&
		formData.email.length > 0 &&
		formData.email.length <= FIELDS.EMAIL_MAX_LENGTH &&
		emailRegex.test(formData.email) &&
		formData.cellphone.length > 0 &&
		formData.cellphone.length <= FIELDS.CELLPHONE_MAX_LENGTH

	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<Link to="/" className={styles.backButton}>
					<svg className={styles.backIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<title>Volver</title>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
					Volver
				</Link>

				<h1 className={styles.title}>Registrar Usuario</h1>
				
				{state?.error && (
					<div className={styles.errorMessage}>
						{state.error}
					</div>
				)}

				{state?.success && (
					<div className={styles.successMessage}>
						Usuario registrado exitosamente
					</div>
				)}
				
				<form action={formAction} className={styles.form} autoComplete='off'>
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
						<label htmlFor="name" className={styles.label}>
							Nombre completo
						</label>
						<input
							id="name"
							name="name"
							type="text"
							value={formData.name}
							onChange={handleChange}
							maxLength={FIELDS.NAME_MAX_LENGTH}
							className={styles.input}
							placeholder="Juan Pérez"
							required
							disabled={isPending}
						/>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="email" className={styles.label}>
							Correo electrónico
						</label>
						<input
							id="email"
							name="email"
							type="email"
							value={formData.email}
							onChange={handleChange}
							maxLength={FIELDS.EMAIL_MAX_LENGTH}
							autoComplete="off"
							className={styles.input}
							placeholder="juan@ejemplo.com"
							required
							disabled={isPending}
						/>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="phone" className={styles.label}>
							Teléfono
						</label>
						<div className={styles.phoneInputGroup}>
							<select
								name="countryCode"
								className={styles.countryCodeSelect}
								disabled={isPending}
								defaultValue={defaultCountryCode}
							>
								{Object.entries(countryCodes).map(([code, dialCode]) => (
									<option key={code} value={dialCode}>
										{getFlagEmoji(code)} {dialCode}
									</option>
								))}
							</select>
							<input
								id="cellphone"
								name="cellphone"
								type="tel"
								value={formData.cellphone}
								onChange={handleChange}
								maxLength={FIELDS.CELLPHONE_MAX_LENGTH}
								className={styles.phoneInput}
								placeholder="600 000 000"
								required
								disabled={isPending}
							/>
						</div>
					</div>

					<div className={styles.buttonGroup}>
						<button 
							type="submit" 
							className={`${styles.button} ${styles.buttonPrimary}`}
							disabled={isPending || !isFormValid}
						>
							{isPending ? 'Creando cuenta...' : 'Crear cuenta'}
						</button>
						<Link to="/" className={`${styles.button} ${styles.buttonSecondary}`}>
							<span>Cancelar</span>
						</Link>
					</div>
				</form>
			</div>
		</div>
	)
}
