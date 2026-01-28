import { User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';

import { ChangeChatSettingsInput } from './inputs/change-chat-settings.input';
import { SendMessageInput } from './inputs/send-message.input';
import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ChatService {
	constructor(private readonly prismaService: PrismaService) {}

	async findMessagesByStream(streamId: string) {
		const messages = await this.prismaService.chatMessage.findMany({
			where: { streamId },
			orderBy: { createdAt: 'desc' },
			include: { user: true },
		});

		return messages;
	}

	async sendMessage(
		userId: string,
		streamId: string,
		input: SendMessageInput,
	) {
		const { text } = input;

		const stream = await this.prismaService.stream.findUnique({
			where: { id: streamId },
		});

		if (!stream) {
			throw new NotFoundException('Stream not found');
		}

		if (!stream.isLive) {
			throw new BadRequestException('Stream non in live');
		}

		await this.prismaService.chatMessage.create({
			data: {
				text,
				user: { connect: { id: userId } },
				stream: { connect: { id: stream.id } },
			},
		});

		return true;
	}

	async changeSettings(user: User, input: ChangeChatSettingsInput) {
		const {
			isChatEnabled,
			isChatFollowersOnly,
			isChatPremiumFollowersOnly,
		} = input;

		await this.prismaService.stream.update({
			where: { userId: user.id },
			data: {
				isChatEnabled,
				isChatFollowersOnly,
				isChatPremiumFollowersOnly,
			},
		});

		return true;
	}
}
