import type { User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';

import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionService {
	constructor(private readonly prisnaService: PrismaService) {}

	async findMySponsors(user: User) {
		const sponsors =
			await this.prisnaService.sponsorshipSubscription.findMany({
				where: { channelId: user.id },
				orderBy: { createdAt: 'desc' },
				include: { plan: true, user: true },
			});
		return sponsors;
	}
}
