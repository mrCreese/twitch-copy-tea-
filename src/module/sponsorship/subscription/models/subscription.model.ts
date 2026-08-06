import { SponsorshipSubscription, TransactionStatus } from '@/prisma/generated';
import { UserModel } from '@/src/module/auth/account/models/user.model';

import { PlanModel } from '../../plan/models/plan.model';

import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SubscriptionModel implements SponsorshipSubscription {
	@Field(() => ID)
	id: string;

	@Field(() => Date)
	expiresAt: Date;

	@Field(() => UserModel)
	user: UserModel;

	@Field(() => String)
	userId: string;

	@Field(() => PlanModel)
	plan: PlanModel;

	@Field(() => String)
	planId: string;

	@Field(() => UserModel)
	channel: UserModel;

	@Field(() => String)
	channelId: string;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}
