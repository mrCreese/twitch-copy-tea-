import { Stream } from '@/prisma/generated';

import { UserModel } from '../../auth/account/models/user.model';
import { CategoryModel } from '../../category/models/category.model';
import { ChatMessageModel } from '../../chat/models/chat-message.model';

import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StreamModel implements Stream {
	@Field(() => ID)
	id: string;

	@Field(() => String)
	title: string;

	@Field(() => String, { nullable: true })
	thumbnailUrl: string;

	@Field(() => String, { nullable: true })
	ingresId: string;

	@Field(() => String, { nullable: true })
	serverUrl: string;

	@Field(() => String, { nullable: true })
	streamKey: string;

	@Field(() => Boolean)
	isLive: boolean;

	@Field(() => Boolean)
	isChatEnabled: boolean;

	@Field(() => Boolean)
	isChatFollowersOnly: boolean;

	@Field(() => Boolean)
	isChatPremiumFollowersOnly: boolean;

	@Field(() => String)
	userId: string;

	@Field(() => CategoryModel)
	category: CategoryModel;

	@Field(() => [ChatMessageModel])
	chatMessages: ChatMessageModel;

	@Field(() => String)
	categoryId: string;

	@Field(() => UserModel)
	user: UserModel;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}
