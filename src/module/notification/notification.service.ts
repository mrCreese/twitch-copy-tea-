import { User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';

import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
	constructor(private readonly prismaService: PrismaService) {}

	async findunreadCount(user: User) {
		const count = await this.prismaService.notification.count({
			where: { isRead: false, userId: user.id },
		});

		return count;
	}

	async findByuser(user: User) {
		await this.prismaService.notification.updateMany({
			where: { isRead: false, userId: user.id },
			data: { isRead: true },
		});

		const notifications = await this.prismaService.notification.findMany({
			where: { userId: user.id },
			orderBy: { createdAt: 'desc' },
		});

		return notifications;
	}
}
