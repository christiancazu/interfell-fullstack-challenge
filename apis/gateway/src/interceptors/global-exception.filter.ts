import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()

		let status = HttpStatus.INTERNAL_SERVER_ERROR
		let errorResponse: any = 'Internal server error'

		// Manejar errores de microservicios TCP (error directo con statusCode)
		if (exception.statusCode && !exception.getStatus) {
			status = exception.statusCode
			errorResponse = {
				message: exception.message,
				errors: exception.errors,
			}
		} else if (exception.error) {
			// Formato alternativo de TCP (error envuelto)
			const error = exception.error
			status = error.statusCode || 500
			errorResponse = {
				message: error.message,
				errors: error.errors,
			}
		} else if (exception instanceof HttpException) {
			status = exception.getStatus()
			errorResponse = exception.getResponse()
		} else if (exception.response && exception.status) {
			status = exception.status
			errorResponse = exception.response
		} else if (exception instanceof Error) {
			errorResponse = exception.message
		}

		// Si es un error 500 o superior, usar mensaje genérico
		if (status >= 500) {
			errorResponse = 'El servicio no esta disponible en este momento'
		}

		response.status(status).json({
			success: false,
			error: errorResponse,
		})
	}
}
