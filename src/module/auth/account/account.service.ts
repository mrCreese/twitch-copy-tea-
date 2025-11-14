import { hash } from 'argon2';

import { PrismaService } from '@/src/core/prisma/prisma.service';

import { VerificationService } from '../verification/verification.service';

import { CreateUserInput } from './inputs/create-user.input';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class AccountService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly verificationService: VerificationService,
	) {}

	async me(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: { id },
		});
		return user;
	}

	public async create(input: CreateUserInput) {
		const { username, email, password } = input;

		const isUsernameExists = await this.prismaService.user.findUnique({
			where: { username },
		});

		if (isUsernameExists) {
			throw new ConflictException('Questo username ocupato');
		}

		const isEmailExists = await this.prismaService.user.findUnique({
			where: { email },
		});

		if (isEmailExists) {
			throw new ConflictException('Questa email è gia registrata');
		}
		const user = await this.prismaService.user.create({
			data: {
				username,
				email,
				password: await hash(password),
				displayName: username,
			},
		});

		await this.verificationService.sendVerificationToken(user);
		return true;
	}
	/* 
	async findAll() {
		const users = await this.prismaService.user.findMany();

		return users;
	} */
}
