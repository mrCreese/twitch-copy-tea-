import type { NotificationSettings } from '@/prisma/generated';

import { UserModel } from '../../auth/account/models/user.model';

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NotificationSettingModel implements NotificationSettings {
	@Field(() => String)
	id: string;

	@Field(() => Boolean)
	siteNotifications: boolean;

	@Field(() => Boolean)
	telegramNotifications: boolean;

	@Field(() => UserModel)
	user: UserModel;

	@Field(() => String)
	userId: string;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}

@ObjectType()
export class ChangenotificationSettingsResponse {
	@Field(() => NotificationSettingModel)
	notificationSettings: NotificationSettingModel;

	@Field(() => String, { nullable: true })
	telegramAuthToken?: string;
}
