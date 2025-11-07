import { hash, verify } from 'argon2';

import type { User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';

import { ChangeEmailInput } from './inputs/change-email.input';
import { ChangePasswordInput } from './inputs/change-passwort.input';
import { CreateUserInput } from './inputs/create-user.input';
import {
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AccountService {
	public constructor(
		private readonly prismaService: PrismaService,
		/* 	private readonly verificationService: VerificationService, */
	) {}

	async findAll() {
		const users = await this.prismaService.user.findMany();

		return users;
	}

	/* 	async me(id: string) {
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

	async changeEmail(user: User, input: ChangeEmailInput) {
		const { email } = input;

		await this.prismaService.user.update({
			where: { id: user.id },
			data: { email },
		});

		return true;
	}

	async changePassword(user: User, input: ChangePasswordInput) {
		const { oldPassword, newPassword } = input;

		const isValidPassword = await verify(user.password, oldPassword);
		if (!isValidPassword) {
			throw new UnauthorizedException('Password precedente non valido');
		}

		await this.prismaService.user.update({
			where: { id: user.id },
			data: { password: await hash(newPassword) },
		});

		return true;
	} */
}
