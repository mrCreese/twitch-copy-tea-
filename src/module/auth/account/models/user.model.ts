import type { User } from '@/prisma/generated';
import { FollowModel } from '@/src/module/follow/models/follow.model';
import { NotificationSettingModel } from '@/src/module/notification/models/notification-settings.model';
import { NotificationModel } from '@/src/module/notification/models/notification.model';
import { PlanModel } from '@/src/module/sponsorship/plan/models/plan.model';
import { SubscriptionModel } from '@/src/module/sponsorship/subscription/models/subscription.model';
import { StreamModel } from '@/src/module/stream/models/stream.model';

import { SocialLinkModel } from '../../profile/models/social-link.model';

import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserModel implements User {
	@Field(() => ID)
	id: string;

	@Field(() => String)
	email: string;

	@Field(() => ID)
	username: string;

	@Field(() => String)
	password: string;

	@Field(() => String)
	displayName: string;

	@Field(() => String, { nullable: true })
	avatar: string;

	@Field(() => String, { nullable: true })
	bio: string;

	@Field(() => String, { nullable: true })
	telegramId: string;

	@Field(() => Boolean)
	isVerified: boolean;

	@Field(() => Boolean)
	isEmailVerified: boolean;

	@Field(() => Boolean)
	isTotpEnabled: boolean;

	@Field(() => Boolean)
	isDeactivated: boolean;

	@Field(() => Date, { nullable: true })
	deactivatedAt: Date;

	@Field(() => String, { nullable: true })
	totpSecret: string;

	@Field(() => [SocialLinkModel])
	socialLinks: SocialLinkModel[];

	@Field(() => [FollowModel])
	followers: FollowModel[];

	@Field(() => [FollowModel])
	followings: FollowModel[];

	@Field(() => StreamModel, { nullable: true })
	stream?: StreamModel;

	@Field(() => [NotificationModel])
	notifications!: NotificationModel[];

	@Field(() => NotificationSettingModel, { nullable: true })
	notificationSettings?: NotificationSettingModel;

	@Field(() => [SubscriptionModel], { nullable: true })
	sponsorshipSubscriptions?: SubscriptionModel[];

	@Field(() => [PlanModel], { nullable: true })
	sponsrshipPlans?: PlanModel[];

	@Field(() => Date)
	createdAt!: Date;

	@Field(() => Date)
	updatedAt!: Date;
}
