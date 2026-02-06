import type { User } from '@/prisma/generated';
import { FollowModel } from '@/src/module/follow/models/follow.model';
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

	@Field(() => StreamModel)
	stream: StreamModel;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}
