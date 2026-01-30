import { HttpService } from '@nestjs/axios'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class UserExistsGuard implements CanActivate {
	constructor(private readonly httpService: HttpService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const { document, cellphone } = request.body

		const response = await firstValueFrom(
			this.httpService.post('/verify', { document, cellphone }),
		)

		request.verifiedUserId = response.data.id

		return true
	}
}
