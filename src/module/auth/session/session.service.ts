import { verify } from 'argon2';
import type { Request } from 'express';
import { TOTP } from 'otpauth';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { RedisService } from '@/src/core/redis/redis.service';

/* import { UserSession } from '@/src/shared/types/user-session.types';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.utils';
import { destroySession, saveSession } from '@/src/shared/utils/session.utl';

import { VerificationService } from '../verification/verification.service'; */

import { LoginInput } from './inputs/login.input';
import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly redisService: RedisService,
		/* private readonly verificationService: VerificationService, */
	) {}

	/* 	async findByUser(req: Request) {
		const userId = req.session.userId;
		if (!userId) throw new NotFoundException('Utente non trovato');

		const keys = (await this.redisService.keys('*')) || [];
		const userSessions: UserSession[] = [];

		for (const key of keys) {
			const sessionData = await this.redisService.get(key);

			if (sessionData) {
				const session = JSON.parse(sessionData);
				if (session.userId === userId) {
					userSessions.push({ ...session, id: key.split(':')[1] });
				}
			}
		}

		userSessions.sort((a, b) => b.createdAt - a.createdAt);

		return userSessions.filter(session => session.id !== req.session.id);
	}

	async findCurrent(req: Request) {
		const sessionId = req.session.id;

		const sessionData = await this.redisService.get(
			`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${
				sessionId
			}`,
		);
		const session = JSON.parse(sessionData || '');

		return {
			...session,
			id: sessionId,
		};
	} */

	async login(req: Request, input: LoginInput /*  userAgent: string */) {
		const { login, password /* pin */ } = input;

		const user = await this.prismaService.user.findFirst({
			where: {
				OR: [
					{ username: { equals: login } },
					{ email: { equals: login } },
				],
			},
		});

		if (!user) {
			throw new NotFoundException('Utente non trovato');
		}

		const isVlaidPassword = await verify(user.password, password);

		if (!isVlaidPassword) {
			throw new UnauthorizedException('Password non valida');
		}

		return new Promise((resolve, reject) => {
			req.session.createdAt = new Date();
			req.session.userId = user.id;

			req.session.save(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Errore durante salvataggio sessione',
						),
					);
				}
				return resolve(user);
			});
		});

		/* 		if (!user.isEmailVerified) {
			await this.verificationService.sendVerificationToken(user);
			throw new BadRequestException(
				'Account non autentificato. Verificare email',
			);
		}
		if (user.isTotpEnabled) {
			if (!pin) {
				return {
					message: 'Necessario codice per concludere autorizazione',
				};
			}

			if (!user.totpSecret) {
				throw new BadRequestException(
					"TOTP secret non trovato per l'utente",
				);
			}
			const totp = new TOTP({
				issuer: 'CreeseStream',
				label: `${user.email}`,
				algorithm: 'SHA1',
				digits: 6,
				secret: user.totpSecret,
			});
			const delta = totp.validate({ token: pin });
			if (delta === null) {
				throw new BadRequestException('Code errato');
			}
		}

		const metadata = getSessionMetadata(req, userAgent);

		return saveSession(req, user, metadata); */
	}

	async logout(req: Request) {
		/* return destroySession(req, this.configService); */

		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Errore durante salvataggio sessione',
						),
					);
				}

				req.res?.clearCookie(
					this.configService.getOrThrow('SESSION_NAME'),
				);
				return resolve(true);
			});
		});
	}

	/* 	async cleaSession(req: Request) {
		req.res?.clearCookie(
			this.configService.getOrThrow<string>('SESSION_NAME'),
		);
		return true;
	}

	async remove(req: Request, id: string) {
		if (req.session.id === id) {
			throw new ConflictException(
				'Corrente sessione non pue essere eliminata',
			);
		}

		await this.redisService.del(
			`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${id}`,
		);

		return true;
	} */
}
