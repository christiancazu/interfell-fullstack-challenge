import {
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
} from '@tanstack/react-router'
import { AppLayout } from './layouts/AppLayout'
import { Balance } from './routes/balance/Balance'
import { Home } from './routes/home/Home'
import { Register } from './routes/register/Register'
import { RequestPayment } from './routes/request-payment/RequestPayment'
import { SendPayment } from './routes/SendPayment'

const rootRoute = createRootRoute({
	component: () => <Outlet />,
})

const layoutRoute = createRoute({
	getParentRoute: () => rootRoute,
	id: 'layout',
	component: AppLayout,
})

const indexRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/',
	component: Home,
})

const registerRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/register',
	component: Register,
})

const balanceRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/balance',
	component: Balance,
})

const sendPaymentRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/send-payment',
	component: SendPayment,
})

const requestPaymentRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/request-payment',
	component: RequestPayment,
})

const routeTree = rootRoute.addChildren([
	layoutRoute.addChildren([
		indexRoute,
		registerRoute,
		balanceRoute,
		sendPaymentRoute,
		requestPaymentRoute,
	]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}
