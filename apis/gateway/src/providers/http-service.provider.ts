import { HttpService } from '@nestjs/axios'
import { HttpException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosError, AxiosResponse } from 'axios'

export const httpServiceProvider = {
	provide: HttpService,
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => {
		const axiosInstance = axios.create({
			baseURL: `http://${configService.get('MS_USERS_HOST') || 'localhost'}:${configService.get('MS_USERS_PORT') || '5001'}/api/users`,
			timeout: 5000,
		})

		// Interceptor global para errores HTTP
		axiosInstance.interceptors.response.use(
			(response: AxiosResponse) => response,
			(error: AxiosError) => {
				throw new HttpException(
					error.response?.data || error.message,
					error.response?.status || 500,
				)
			},
		)

		return new HttpService(axiosInstance)
	},
}
