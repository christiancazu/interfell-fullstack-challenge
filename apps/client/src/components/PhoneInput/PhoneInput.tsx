import { customList } from 'country-codes-list'
import { useEffect, useRef, useState } from 'react'
import { getFlagEmoji } from '../../utils/countryCode'
import styles from './PhoneInput.module.css'

const countryCodes = customList('countryCode' as any, '+{countryCallingCode}')
const countryNames = customList('countryCode' as any, '{countryNameEn}')

async function getCountryByIP(): Promise<string> {
	try {
		const response = await fetch('https://ipapi.co/json/')
		const data = await response.json()
		const countryCode = data.country_code
		return countryCodes[countryCode] || ''
	} catch {
		return ''
	}
}

interface PhoneInputProps {
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	disabled?: boolean
	maxLength?: number
	placeholder?: string
	name?: string
	id?: string
}

export function PhoneInput({
	value,
	onChange,
	disabled = false,
	maxLength,
	placeholder = '999 999 999',
	name = 'cellphone',
	id = 'cellphone',
}: PhoneInputProps) {
	const [detectedCountryCode, setDetectedCountryCode] = useState('')
	const [selectedCode, setSelectedCode] = useState('')
	const [searchTerm, setSearchTerm] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		getCountryByIP().then((code) => {
			setDetectedCountryCode(code)
			setSelectedCode(code)
		})
	}, [])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const filteredCountries = Object.entries(countryCodes).filter(
		([code, dialCode]) => {
			const countryName = countryNames[code].toLowerCase()
			const search = searchTerm.toLowerCase()
			return countryName.includes(search) || dialCode.includes(search)
		},
	)

	const handleSelectCountry = (dialCode: string) => {
		setSelectedCode(dialCode)
		setIsOpen(false)
		setSearchTerm('')
	}

	const getSelectedCountryDisplay = () => {
		if (!selectedCode) return 'Seleccionar'
		const entry = Object.entries(countryCodes).find(
			([_, code]) => code === selectedCode,
		)
		if (!entry) return 'Seleccionar'
		const [code] = entry
		return `${getFlagEmoji(code)} ${selectedCode}`
	}

	return (
		<div className={styles.phoneInputGroup}>
			<input type="hidden" name="countryCode" value={selectedCode} />
			<div className={styles.countryCodeWrapper} ref={dropdownRef}>
				<button
					type="button"
					className={styles.countryCodeSelect}
					disabled={disabled}
					onClick={() => setIsOpen(!isOpen)}
				>
					{getSelectedCountryDisplay()}
				</button>
				{isOpen && (
					<div className={styles.countryCodeDropdown}>
						<input
							type="text"
							className={styles.countryCodeSearch}
							placeholder="Buscar país..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							autoFocus
						/>
						<div className={styles.countryCodeList}>
							{filteredCountries.length === 0 ? (
								<div className={styles.countryCodeOption}>
									No se encontraron países
								</div>
							) : (
								filteredCountries.map(([code, dialCode]) => (
									<button
										key={code}
										type="button"
										className={styles.countryCodeOption}
										onClick={() => handleSelectCountry(dialCode)}
									>
										{getFlagEmoji(code)} {countryNames[code]} {dialCode}
									</button>
								))
							)}
						</div>
					</div>
				)}
			</div>
			<input
				id={id}
				name={name}
				type="tel"
				value={value}
				onChange={onChange}
				maxLength={maxLength}
				className={styles.phoneInput}
				placeholder={placeholder}
				required
				disabled={disabled}
			/>
		</div>
	)
}
