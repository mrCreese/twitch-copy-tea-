import { PrismaService } from '@/src/core/prisma/prisma.service';

import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ChannelService {
	constructor(private readonly prismaService: PrismaService) {}

	async findRecommendedChannels() {
		const channels = await this.prismaService.user.findMany({
			where: { isDeactivated: false },
			orderBy: { followings: { _count: 'desc' } },
			include: { stream: true },
			take: 7,
		});

		return channels;
	}

	async findByUsername(username: string) {
		const channel = await this.prismaService.user.findUnique({
			where: { username, isDeactivated: false },
			include: {
				socialLinks: { orderBy: { position: 'asc' } },
				stream: { include: { category: true } },
				followings: true,
			},
		});

		if (!channel) {
			throw new NotFoundException('Channel not found');
		}

		return channel;
	}

	async findFollowersCountByChannel(channelId: string) {
		const count = await this.prismaService.follow.count({
			where: { following: { id: channelId } },
		});
		return count;
	}
}
