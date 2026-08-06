import { AccessToken } from 'livekit-server-sdk';
import * as sharp from 'sharp';

import type { Prisma, User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';

import { StorageService } from '../libs/storage/storage.service';

import { ChangeStreamInput } from './inputs/change-stream-info.input';
import { FiltersInput } from './inputs/filter.input';
import { GenerateStreamTokenInput } from './inputs/generate-stream-token.input';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileUpload } from 'graphql-upload/processRequest.mjs';

@Injectable()
export class StreamService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService,
		private readonly configService: ConfigService,
	) {}

	async findAll(input: FiltersInput = {}) {
		const { take, skip, searchTerm } = input;

		const whereClause = searchTerm
			? this.findBySearchTermFilter(searchTerm)
			: undefined;
		const streams = await this.prismaService.stream.findMany({
			take: take ?? 12,
			skip: skip ?? 0,
			where: { user: { isDeactivated: false }, ...whereClause },
			include: { user: true, category: true },
			orderBy: { createdAt: 'desc' },
		});

		return streams;
	}

	async findRandom() {
		const total = await this.prismaService.stream.count({
			where: { user: { isDeactivated: false } },
		});
		const randomIndexes = new Set<number>();

		while (randomIndexes.size < 4) {
			const randomindex = Math.floor(Math.random() * total);

			randomIndexes.add(randomindex);
		}

		const streams = await this.prismaService.stream.findMany({
			where: { user: { isDeactivated: false } },
			include: { user: true, category: true },
			take: total,
			skip: 0,
		});

		return Array.from(randomIndexes).map(index => streams[index]);
	}

	async changeInfo(user: User, input: ChangeStreamInput) {
		const { title, categoryId } = input;

		await this.prismaService.stream.update({
			where: { userId: user.id },
			data: { title, category: { connect: { id: categoryId } } },
		});
		return true;
	}

	async changeThumbnail(user: User, file: FileUpload) {
		const stream = await this.findByUserId(user);
		if (stream?.thumbnailUrl) {
			await this.storageService.remove(stream.thumbnailUrl);
		}

		const chunks: Buffer[] = [];
		for await (const chunk of file.createReadStream()) {
			chunks.push(chunk);
		}

		const buffer = Buffer.concat(chunks);
		const fileName = `/streams/${user.username}.webp`;

		const isGif = file?.filename?.endsWith('.gif');
		const sharpOptions = isGif ? { animated: true } : {};

		const processedBuffer = await sharp(buffer, sharpOptions)
			.resize(1280, 720)
			.webp()
			.toBuffer();

		await this.storageService.upload(
			processedBuffer,
			fileName,
			'image/webp',
		);

		await this.prismaService.stream.update({
			where: { userId: user.id },
			data: { thumbnailUrl: fileName },
		});

		return true;
	}

	async removeThumbnail(user: User) {
		const stream = await this.findByUserId(user);
		if (!stream?.thumbnailUrl) return;

		await this.storageService.remove(stream.thumbnailUrl);

		await this.prismaService.stream.update({
			where: { userId: user.id },
			data: { thumbnailUrl: null },
		});

		return true;
	}

	async generateStreamToken(input: GenerateStreamTokenInput) {
		const { userId, channelId } = input;

		let self: { id: string; username: string };

		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
		});

		if (user) {
			self = { id: user.id, username: user.username };
		} else {
			self = {
				id: userId,
				username: `Visitatore ${Math.floor(Math.random() * 100000)}`,
			};
		}

		const channel = await this.prismaService.user.findUnique({
			where: { id: channelId },
		});

		if (!channel) {
			throw new NotFoundException('Canale non trovato');
		}

		const isHost = self.id === channel.id;

		const token = new AccessToken(
			this.configService.getOrThrow('LIVEKIT_API_KEY'),
			this.configService.getOrThrow('LIVEKIT_API_SECRET'),
			{
				identity: isHost ? `Host-${self.id}` : self.id.toString(),
				name: self.username,
			},
		);

		token.addGrant({
			room: channel.id,
			roomJoin: true,
			canPublish: false,
			canSubscribe: true,
		});

		return { token: token.toJwt() };
	}

	private async findByUserId(user: User) {
		const stream = await this.prismaService.stream.findUnique({
			where: { userId: user.id },
		});
		return stream;
	}

	private findBySearchTermFilter(
		searchTerm: string,
	): Prisma.StreamWhereInput {
		return {
			OR: [
				{
					title: {
						contains: searchTerm,
						mode: 'insensitive',
					},
				},
				{
					user: {
						username: { contains: searchTerm, mode: 'insensitive' },
					},
				},
				{
					category: {
						title: { contains: searchTerm, mode: 'insensitive' },
					},
				},
			],
		};
	}
}
