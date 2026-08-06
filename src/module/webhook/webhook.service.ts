import Stripe from 'stripe';

import { TransactionStatus } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';

import { LivekitService } from '../libs/livekit/livekit.service';
import { StripeService } from '../libs/stripe/stripe.service';
import { TelegramService } from '../libs/telegram/telegram.service';
import { NotificationService } from '../notification/notification.service';

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly livekitService: LivekitService,
		private readonly notificationService: NotificationService,
		private readonly telegramServise: TelegramService,
		private readonly stripeService: StripeService,
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
					followingId: stream?.user?.id,
					follower: { isDeactivated: false },
				},
				include: {
					follower: { include: { notificationSettings: true } },
				},
			});
			if (!stream?.user) {
				throw new NotFoundException('Stream not found');
			}
			for (const follow of followers) {
				const follower = follow.follower;

				if (follower.notificationSettings?.siteNotifications) {
					await this.notificationService.createStreamStart(
						follower.id,
						stream?.user,
					);
				}
				if (
					follower.notificationSettings?.telegramNotifications &&
					follower.telegramId
				) {
					await this.telegramServise.sendStreamStart(
						follower.id,
						stream?.user,
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

	async receiveWebhookStripe(event: Stripe.Event) {
		const session = event.data.object as Stripe.Checkout.Session;
		if (event.type === 'checkout.session.completed') {
			const planId = session.metadata?.planId;
			const userId = session.metadata?.userId;
			const channelId = session.metadata?.channelId;

			const expiresAt = new Date();

			expiresAt.setDate(expiresAt.getDate() + 30);
			const sponsorshipSubscription =
				await this.prismaService.sponsorshipSubscription.create({
					data: { expiresAt, planId, userId, channelId },
					include: {
						plan: true,
						user: true,
						channel: { include: { notificationSettings: true } },
					},
				});
			await this.prismaService.transaction.updateMany({
				where: {
					stripeSubscriptionId: session.id,
					status: TransactionStatus.PENDING,
				},
				data: { status: TransactionStatus.SUCCESS },
			});

			if (
				sponsorshipSubscription.channel?.notificationSettings
					?.siteNotifications &&
				sponsorshipSubscription.plan &&
				sponsorshipSubscription.user
			) {
				await this.notificationService.createNewSponsorship(
					sponsorshipSubscription.channel.id,
					sponsorshipSubscription.plan,
					sponsorshipSubscription.user,
				);
			}

			if (
				sponsorshipSubscription.channel?.notificationSettings
					?.telegramNotifications &&
				sponsorshipSubscription.channel.telegramId &&
				sponsorshipSubscription.plan &&
				sponsorshipSubscription.user
			) {
				await this.telegramServise.sendNewSponsorship(
					sponsorshipSubscription.channel.telegramId,
					sponsorshipSubscription.plan,
					sponsorshipSubscription.user,
				);
			}
		}

		if (event.type === 'checkout.session.expired') {
			await this.prismaService.transaction.updateMany({
				where: {
					stripeSubscriptionId: session.id,
				},
				data: { status: TransactionStatus.EXPIRED },
			});
		}
		if (event.type === 'checkout.session.async_payment_failed') {
			await this.prismaService.transaction.updateMany({
				where: {
					stripeSubscriptionId: session.id,
				},
				data: { status: TransactionStatus.FAILED },
			});
		}
	}

	constructorStripeEvent(payload: any, signature: any) {
		return this.stripeService.webhooks.constructEvent(
			payload,
			signature,
			this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET'),
		);
	}
}
