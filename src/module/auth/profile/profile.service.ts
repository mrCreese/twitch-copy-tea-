import { Buffer } from 'buffer';
import * as sharp from 'sharp';

import type { User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';

import { StorageService } from '../../libs/storage/storage.service';

import { ChangeProfileInfoInput } from './inputs/change-profile-info.input';
import { ConflictException, Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload/processRequest.mjs';

@Injectable()
export class ProfileService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService,
	) {}

	async changeAvatar(user: User, file: FileUpload) {
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

	async changeInfo(user: User, input: ChangeProfileInfoInput) {
		const { username, displayName, bio } = input;

		const usernameExists = await this.prismaService.user.findUnique({
			where: { username },
		});

		if (usernameExists && username !== user.username) {
			throw new ConflictException('Username non disponibile');
		}

		await this.prismaService.user.update({
			where: { id: user.id },
			data: { username, displayName, bio },
		});

		return true;
	}
}
