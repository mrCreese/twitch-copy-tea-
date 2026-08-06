import { User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';

import { StripeService } from '../../libs/stripe/stripe.service';

import { CreatePlanInput } from './inputs/create-plan.input';
import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

@Injectable()
export class PlanService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly stripeService: StripeService,
	) {}

	async findMyPlans(user: User) {
		const plans = await this.prismaService.sponsorshipPlan.findMany({
			where: { channelId: user.id },
		});
		return plans;
	}

	async create(user: User, input: CreatePlanInput) {
		const { title, description, price } = input;

		const channel = await this.prismaService.user.findUnique({
			where: { id: user.id },
		});

		if (!channel?.isVerified) {
			throw new ForbiddenException(
				'Solo utenti verificati possono creare piani di sponsorizzazione',
			);
		}

		const stripePlan = await this.stripeService.plans.create({
			amount: Math.round(price * 100),
			currency: 'eur',
			interval: 'month',
			product: { name: title },
		});

		console.log(JSON.stringify(stripePlan, null, 2));
		if (!stripePlan?.product) {
			throw new NotFoundException(
				'Creaazione del piano si sponsorizazione falito',
			);
		}

		await this.prismaService.sponsorshipPlan.create({
			data: {
				title,
				description,
				price,
				stripeProductId: stripePlan?.product.toString(),
				stripePlanId: stripePlan.id,
				channel: { connect: { id: user.id } },
			},
		});
		return true;
	}
	async remove(planId: string) {
		const plan = await this.prismaService.sponsorshipPlan.findUnique({
			where: { id: planId },
		});

		if (!plan) {
			throw new NotFoundException(
				'Piano di sponsorizzazione non trovato',
			);
		}

		await this.stripeService.plans.del(plan.stripePlanId);
		await this.stripeService.products.del(plan.stripeProductId);

		await this.prismaService.sponsorshipPlan.delete({
			where: { id: planId },
		});
		return true;
	}
}
