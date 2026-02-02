import { Link, Outlet, useMatchRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DarkModeToggle } from '../components/dark-mode/DarkModeToggle'
import styles from './DashboardLayout.module.css'

export function DashboardLayout() {
	const matchRoute = useMatchRoute()
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)

	const isActive = (path: string) => {
		return matchRoute({ to: path })
	}

	const closeSidebar = () => setIsSidebarOpen(false)

	return (
		<div className={styles.container}>
			{isSidebarOpen && (
				<div
					className={styles.overlay}
					onClick={closeSidebar}
					aria-hidden="true"
				/>
			)}
			<aside
				className={`${styles.sidebar} ${!isSidebarOpen ? 'hidden md:block' : ''}`}
			>
				<div className={styles.sidebarHeader}>
					<div className={styles.sidebarHeaderContent}>
						<h1 className={styles.sidebarTitle}>
							<svg
								className={styles.logoIcon}
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<title>Wallet Icon</title>
								<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
								<path
									fillRule="evenodd"
									d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
									clipRule="evenodd"
								/>
							</svg>
							Wallet
						</h1>
						<button
							onClick={closeSidebar}
							className={styles.closeButton}
							aria-label="Cerrar menú"
						>
							<svg className={styles.closeIcon} fill="currentColor" viewBox="0 0 20 20">
								<title>Close</title>
								<path
									fillRule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					</div>
				</div>
				<nav className={styles.sidebarNav}>
					<Link
						to="/balance"
						className={`${styles.navLink} ${isActive('/balance') ? styles.navLinkActive : ''}`}
						onClick={closeSidebar}
					>
						<svg
							className={styles.navIcon}
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<title>Balance</title>
							<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
							<path
								fillRule="evenodd"
								d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
								clipRule="evenodd"
							/>
						</svg>
						Balance
					</Link>
					<Link
						to="/send-payment"
						className={`${styles.navLink} ${isActive('/send-payment') ? styles.navLinkActive : ''}`}
						onClick={closeSidebar}
					>
						<svg
							className={styles.navIcon}
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<title>Send Payment</title>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
								clipRule="evenodd"
							/>
						</svg>
						Enviar Pago
					</Link>
					<Link
						to="/request-payment"
						className={`${styles.navLink} ${isActive('/request-payment') ? styles.navLinkActive : ''}`}
						onClick={closeSidebar}
					>
						<svg
							className={styles.navIcon}
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<title>Request Payment</title>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
								clipRule="evenodd"
								transform="rotate(180 10 10)"
							/>
						</svg>
						Solicitar Pago
					</Link>
				</nav>
			</aside>

			<div className={styles.main}>
				<header className={styles.header}>
					<div className={styles.headerContainer}>
						<button
							onClick={() => setIsSidebarOpen(true)}
							className={styles.menuButton}
							aria-label="Abrir menú"
						>
							<svg className={styles.menuIcon} fill="currentColor" viewBox="0 0 20 20">
								<title>Menu</title>
								<path
									fillRule="evenodd"
									d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
						<h2 className={styles.headerTitle}>Dashboard</h2>
					</div>
					<DarkModeToggle />
				</header>
				<main className={styles.content}>
					<Outlet />
				</main>
			</div>
		</div>
	)
}
