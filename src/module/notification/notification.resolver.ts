import { User } from '@/prisma/generated';
import { Authorization } from '@/src/shared/decatators/auth.decorator';
import { Authorized } from '@/src/shared/decatators/authorized.decorator';

import { ChangeNotificationSettingsInput } from './inputs/change-notifications-settings.input';
import { ChangenotificationSettingsResponse } from './models/notification-settings.model';
import { NotificationModel } from './models/notification.model';
import { NotificationService } from './notification.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver('Notification')
export class NotificationResolver {
	constructor(private readonly notificationService: NotificationService) {}

	@Authorization()
	@Query(() => Number, { name: 'findNotificationsUnreadCount' })
	async findUnreadCount(@Authorized() user: User) {
		return this.notificationService.findUnreadCount(user);
	}

	@Authorization()
	@Query(() => [NotificationModel], { name: 'findNotificationsByUser' })
	async findByUser(@Authorized() user: User) {
		return this.notificationService.findByuser(user);
	}

	@Authorization()
	@Mutation(() => ChangenotificationSettingsResponse, {
		name: 'changeNotificationSettings',
	})
	async changeSettings(
		@Authorized() user: User,
		@Args('data') input: ChangeNotificationSettingsInput,
	) {
		return this.notificationService.changeSettings(user, input);
	}
}
