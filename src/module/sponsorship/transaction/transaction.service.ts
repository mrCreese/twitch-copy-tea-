import type { User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';

import { StripeService } from '../../libs/stripe/stripe.service';

import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransactionService {
	constructor(
		public readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly stripeService: StripeService,
	) {}

	async findMyTransactions(user: User) {
		const transactions = await this.prismaService.transaction.findMany({
			where: { userId: user.id },
		});
		return transactions;
	}

	async makePayment(user: User, planId: string) {
		const plan = await this.prismaService.sponsorshipPlan.findUnique({
			where: { id: planId },
			include: { channel: true },
		});

		if (!plan || !plan?.channel?.id) {
			throw new NotFoundException(
				'Piano di sponsorizzazione non trovato',
			);
		}

		if (user.id === plan.channel.id) {
			throw new ConflictException(
				'Impossibile sponsorizzare il proprio canale',
			);
		}
		const existSubscription =
			await this.prismaService.sponsorshipSubscription.findFirst({
				where: { userId: user.id, channelId: plan.channel.id },
			});
		if (existSubscription) {
			throw new ConflictException('Hai già sostenuto questo canale');
		}

		const customer = await this.stripeService.customers.create({
			name: user.username,
			email: user.email,
		});

		const successUrl = `${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/success?price=${encodeURIComponent(plan.price)}&username=${encodeURIComponent(plan.channel.username)}`;
		const cancelUrl =
			this.configService.getOrThrow<string>('ALLOWED_ORIGIN');

		const session = await this.stripeService.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'eur',
						product_data: {
							name: plan.title,
						},
						unit_amount: Math.round(plan.price * 100),
						recurring: { interval: 'month' },
					},
					quantity: 1,
				},
			],
			mode: 'subscription',
			success_url: successUrl,
			cancel_url: cancelUrl,
			customer: customer.id,
			metadata: {
				planId: plan.id,
				userId: user.id,
				channelId: plan.channel.id,
			},
		});

		await this.prismaService.transaction.create({
			data: {
				amount: plan.price,
				currency: session.currency ?? 'eur',
				stripeSubscriptionId: session.id,
				user: { connect: { id: user.id } },
			},
		});

		return { url: session.url };
	}
}
