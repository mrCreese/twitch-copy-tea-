import { SponsorshipPlan } from '@/prisma/generated';
import { UserModel } from '@/src/module/auth/account/models/user.model';

import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PlanModel implements SponsorshipPlan {
	@Field(() => ID)
	id: string;

	@Field(() => String)
	title: string;

	@Field(() => String, { nullable: true })
	description: string;

	@Field(() => Number)
	price: number;

	@Field(() => String)
	stripeProductId: string;

	@Field(() => String)
	stripePlanId: string;

	@Field(() => UserModel)
	channel: UserModel;

	@Field(() => String)
	channelId: string;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}
