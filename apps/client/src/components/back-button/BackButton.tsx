import { Link } from '@tanstack/react-router'
import styles from './BackButton.module.css'

export function BackButton() {
	return (
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
	)
}
