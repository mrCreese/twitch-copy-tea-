import { IsBoolean } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChangeChatSettingsInput {
	@Field(() => Boolean)
	@IsBoolean()
	isChatEnabled: boolean;

	@Field(() => Boolean)
	@IsBoolean()
	isChatFollowersOnly: boolean;

	@Field(() => Boolean)
	@IsBoolean()
	isChatPremiumFollowersOnly: boolean;
}
