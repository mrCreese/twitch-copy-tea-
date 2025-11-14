import type { User } from '@/prisma/generated';

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

	@Field(() => Boolean)
	isVerified: boolean;

	@Field(() => Boolean)
	isEmailVerified: boolean;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}

/* 

	@Field(() => Boolean)
	isTotpEnabled: boolean;

	@Field(() => String, { nullable: true })
	totpSecret: string;





	@Field(() => Boolean)
	isDeactivated: boolean;

	@Field(() => Date, { nullable: true })
	deactivatedAt: Date;

 */
