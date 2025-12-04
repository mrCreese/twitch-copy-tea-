import * as sharp from 'sharp';

import type { Prisma, User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';

import { StorageService } from '../libs/storage/storage.service';

import { ChangeStreamInput } from './inputs/change-stream-info.input';
import { FiltersInput } from './inputs/filter.input';
import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload/processRequest.mjs';

@Injectable()
export class StreamService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService,
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
			include: { user: true },
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
			include: { user: true },
			take: total,
			skip: 0,
		});

		return Array.from(randomIndexes).map(index => streams[index]);
	}

	async changeInfo(user: User, input: ChangeStreamInput) {
		const { title, categoryId } = input;

		await this.prismaService.stream.update({
			where: { userId: user.id },
			data: { title },
		});
		return true;
	}

	async changeThumbnail(user: User, file: FileUpload) {
		if (user.avatar) {
			await this.storageService.remove(user.avatar);
		}

		const chunks: Buffer[] = [];
		for await (const chunk of file.createReadStream()) {
			chunks.push(chunk);
		}

		const buffer = Buffer.concat(chunks);
		const fileName = `/channels/${user.username}.webp`;

		const isGif = file?.filename?.endsWith('.gif');
		const sharpOptions = isGif ? { animated: true } : {};

		const processedBuffer = await sharp(buffer, sharpOptions)
			.resize(512, 512)
			.webp()
			.toBuffer();

		await this.storageService.upload(
			processedBuffer,
			fileName,
			'image/webp',
		);

		await this.prismaService.user.update({
			where: { id: user.id },
			data: { avatar: fileName },
		});

		return true;
	}

	async removeAvatar(user: User) {
		if (!user.avatar) return;

		await this.storageService.remove(user.avatar);

		await this.prismaService.user.update({
			where: { id: user.id },
			data: { avatar: null },
		});

		return true;
	}

	private findByUserId(user: User) {}

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
			],
		};
	}
}
