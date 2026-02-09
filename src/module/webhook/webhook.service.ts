import { PrismaService } from '@/src/core/prisma/prisma.service';

import { LivekitService } from '../libs/livekit/livekit.service';
import { NotificationService } from '../notification/notification.service';

import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly livekitService: LivekitService,
		private readonly notificationService: NotificationService,
	) {}

	async receiveWebhookLiveKit(body: string, authorization: string) {
		const event = this.livekitService.receiver.receive(
			body,
			authorization,
			true,
		);

		if (event.event === 'ingress_started') {
			const stream = await this.prismaService.stream.update({
				where: { ingresId: event.ingressInfo?.ingressId },
				data: { isLive: true },
				include: { user: true },
			});

			const followers = await this.prismaService.follow.findMany({
				where: {
					followingId: stream.user.id,
					follower: { isDeactivated: false },
				},
				include: {
					follower: { include: { notificationsSettings: true } },
				},
			});

			for (const follow of followers) {
				const follower = follow.follower;

				if (follower.notificationsSettings?.siteNotifications) {
					await this.notificationService.createStreamStart(
						follower.id,
						stream.user,
					);
				}
			}
		}
		if (event.event === 'ingress_ended') {
			const stream = await this.prismaService.stream.update({
				where: { ingresId: event.ingressInfo?.ingressId },
				data: { isLive: false },
			});
			await this.prismaService.chatMessage.deleteMany({
				where: { streamId: stream.id },
			});
		}
	}
}
