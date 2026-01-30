import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common'
import { map, Observable } from 'rxjs'

export interface ApiResponse<T> {
	success: boolean
	data?: T
	error?: any
}

@Injectable()
export class ResponseTransformInterceptor<T>
	implements NestInterceptor<T, ApiResponse<T>>
{
	intercept(
		_context: ExecutionContext,
		next: CallHandler,
	): Observable<ApiResponse<T>> {
		return next.handle().pipe(
			map((data) => ({
				success: true,
				data,
			})),
		)
	}
}
