import type { User } from '@/prisma/generated';
import { Authorization } from '@/src/shared/decatators/auth.decorator';
import { Authorized } from '@/src/shared/decatators/authorized.decorator';

import { SubscriptionModel } from './models/subscription.model';
import { SubscriptionService } from './subscription.service';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver('Subscription')
export class SubscriptionResolver {
	constructor(private readonly subscriptionService: SubscriptionService) {}

	@Authorization()
	@Query(() => [SubscriptionModel], { name: 'findMySponsors' })
	async findMySponsors(@Authorized() user: User) {
		return this.subscriptionService.findMySponsors(user);
	}
}
