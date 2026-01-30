import { Injectable } from '@nestjs/common'

@Injectable()
export class SharedService {
	getHelloWorld(): string {
		return 'Hello World from Shared Module!'
	}
}
