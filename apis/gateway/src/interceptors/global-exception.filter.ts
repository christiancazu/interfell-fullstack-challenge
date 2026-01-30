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
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()

		let status = HttpStatus.INTERNAL_SERVER_ERROR
		let errorResponse: any = 'Internal server error'

		if (exception instanceof HttpException) {
			status = exception.getStatus()
			errorResponse = exception.getResponse()
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
