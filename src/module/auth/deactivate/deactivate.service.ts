import { verify } from 'argon2';
import type { Request } from 'express';

import { TokenType, type User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { generateToken } from '@/src/shared/utils/generate-token.util';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util';
import { destroySession } from '@/src/shared/utils/session.util';

import { MailService } from '../../libs/mail/mail.service';

import { DeactivateAccountInput } from './inputs/deactivate-account.input';
import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DeactivateService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly configservice: ConfigService,
		private readonly mailService: MailService,
	) {}

	async deactivate(
		req: Request,
		input: DeactivateAccountInput,
		user: User,
		userAgent: string,
	) {
		const { email, password, pin } = input;

		if (user.email !== email) {
			throw new BadRequestException('Posta errata');
		}
		const isValidPassword = await verify(user.password, password);

		if (!isValidPassword) {
			throw new BadRequestException('Password errato');
		}

		if (!pin) {
			await this.sendDeactivateToken(req, user, userAgent);
			return { message: 'necessario codice conferma' };
		}

		await this.validateDeativatetoken(req, pin);
		return { user };
	}

	async sendDeactivateToken(req: Request, user: User, userAgent: string) {
		const deactivateToken = await generateToken(
			this.prismaService,
			user,
			TokenType.DEACTIVATE_ACCOUNT,
			false,
		);

		const metadata = getSessionMetadata(req, userAgent);
		await this.mailService.sendDeactivateToken(
			user.email,
			deactivateToken.token,
			metadata,
		);

		return true;
	}

	private async validateDeativatetoken(req: Request, token: string) {
		const existingToken = await this.prismaService.token.findUnique({
			where: { token, type: TokenType.DEACTIVATE_ACCOUNT },
		});

		if (!existingToken) {
			throw new NotFoundException('token non trovato');
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date();

		if (hasExpired) {
			throw new BadRequestException('token scaduto');
		}

		if (!existingToken?.userId) {
			throw new BadRequestException('Token non valido');
		}

		await this.prismaService.user.update({
			where: { id: existingToken.userId },
			data: { isDeactivated: true, deactivatedAt: new Date() },
		});

		await this.prismaService.token.delete({
			where: { id: existingToken.id, type: TokenType.DEACTIVATE_ACCOUNT },
		});

		return destroySession(req, this.configservice);
	}
}
