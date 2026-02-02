import { Outlet } from '@tanstack/react-router'
import { DarkModeToggle } from '../components/dark-mode/DarkModeToggle'
import styles from './AppLayout.module.css'

export function AppLayout() {
	return (
		<div className={styles.layout}>
			<header className={styles.header}>
				<div className={styles.headerContent}>
					<h1 className={styles.logo}>Billetera Digital</h1>
					<DarkModeToggle />
				</div>
			</header>
			<main className={styles.main}>
				<Outlet />
			</main>
		</div>
	)
}
