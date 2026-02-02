import { Link } from '@tanstack/react-router'
import styles from './Home.module.css'

export function Home() {
	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<h1 className={styles.title}>Billetera Digital</h1>
				<p className={styles.subtitle}>Selecciona una opción</p>
				
				<nav className={styles.menu}>
					<Link to="/register" className={styles.menuItem}>
						<div className={styles.iconWrapper}>
							<svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<title>Registrar usuario</title>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
							</svg>
						</div>
						<div className={styles.menuContent}>
							<h2 className={styles.menuTitle}>Registrar Usuario</h2>
							<p className={styles.menuDescription}>Crea una nueva cuenta</p>
						</div>
					</Link>

					<Link to="/balance" className={styles.menuItem}>
						<div className={styles.iconWrapper}>
							<svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<title>Ver saldo</title>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div className={styles.menuContent}>
							<h2 className={styles.menuTitle}>Ver Saldo</h2>
							<p className={styles.menuDescription}>Consulta tu balance</p>
						</div>
					</Link>

					<Link to="/request-payment" className={styles.menuItem}>
						<div className={styles.iconWrapper}>
							<svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<title>Solicitar pago</title>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
							</svg>
						</div>
						<div className={styles.menuContent}>
							<h2 className={styles.menuTitle}>Solicitar Pago</h2>
							<p className={styles.menuDescription}>Recibe dinero</p>
						</div>
					</Link>

					<Link to="/send-payment" className={styles.menuItem}>
						<div className={styles.iconWrapper}>
							<svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<title>Confirmar pago</title>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div className={styles.menuContent}>
							<h2 className={styles.menuTitle}>Confirmar Pago</h2>
							<p className={styles.menuDescription}>Envía dinero</p>
						</div>
					</Link>
				</nav>
			</div>
		</div>
	)
}
