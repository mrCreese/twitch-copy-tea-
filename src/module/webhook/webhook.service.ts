import { PrismaService } from '@/src/core/prisma/prisma.service';

import { LivekitService } from '../libs/livekit/livekit.service';

import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly livekitService: LivekitService,
	) {}

	async receiveWebhookLiveKit(body: string, authorization: string) {
		console.log(body);
		const event = this.livekitService.receiver.receive(
			body,
			authorization,
			true,
		);

		if (event.event === 'ingress_started') {
			console.log('STREAM STARTED: ', event.ingressInfo?.url);
			await this.prismaService.stream.update({
				where: { ingresId: event.ingressInfo?.ingressId },
				data: { isLive: true },
			});
		}
		if (event.event === 'ingress_ended') {
			await this.prismaService.stream.update({
				where: { ingresId: event.ingressInfo?.ingressId },
				data: { isLive: false },
			});
		}
	}
}
