import { IsBoolean } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChangeNotificationsSettingsInput {
	@Field(() => Boolean)
	@IsBoolean()
	siteNotifications: boolean;

	@Field(() => Boolean)
	@IsBoolean()
	telegramNotifications: boolean;
}
