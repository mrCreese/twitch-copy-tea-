import { PrismaService } from '@/src/core/prisma/prisma.service';

import { MailService } from '../libs/mail/mail.service';
import { StorageService } from '../libs/storage/storage.service';
import { TelegramService } from '../libs/telegram/telegram.service';

//import { StorageService } from '../libs/storage/storage.service';

import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly storageService: StorageService,
		private readonly telegramService: TelegramService,
	) {}

	@Cron('0 0 * * *')
	async deleteDeactivateAccount() {
		const sevenDaysAgo = new Date();

		sevenDaysAgo.setDate(sevenDaysAgo.getDay() - 7);

		const deactivatedAccounts = await this.prismaService.user.findMany({
			where: {
				isDeactivated: true,
				deactivatedAt: { lte: sevenDaysAgo },
			},
			include: { notificationsSettings: true, stream: true },
		});

		for (const user of deactivatedAccounts) {
			await this.mailService.sendAccountDeletion(user.email);
			if (
				user.notificationsSettings?.telegramNotifications &&
				user.telegramId
			) {
				await this.telegramService.sendAccountDeletion(user.telegramId);
			}

			if (user.avatar) {
				await this.storageService.remove(user.avatar);
			}
			if (user.stream?.thumbnailUrl) {
				await this.storageService.remove(user.stream.thumbnailUrl);
			}
		}

		await this.prismaService.user.deleteMany({
			where: {
				isDeactivated: true,
				deactivatedAt: { lte: sevenDaysAgo },
			},
		});
	}
}
