import { WebhookService } from './webhook.service';
import {
	Body,
	Controller,
	Headers,
	HttpCode,
	HttpStatus,
	Post,
	UnauthorizedException,
} from '@nestjs/common';

@Controller('webhook')
export class WebhookController {
	constructor(private readonly webhookService: WebhookService) {}

	@Post('livekit')
	@HttpCode(HttpStatus.OK)
	async receiveWebhookLiveKit(
		@Body() body: string,
		@Headers('authorization') authorization: string,
	) {
		console.log('WEBHOOK ARRIVATO');
		console.log(authorization);
		console.log(body.toString());
		/* 	if (!authorization) {
			throw new UnauthorizedException('Manca header autorizzazione');
		} */
		return this.webhookService.receiveWebhookLiveKit(body, authorization);
	}
}
