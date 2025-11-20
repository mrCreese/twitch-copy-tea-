import { randomBytes } from 'crypto';
import { encode } from 'hi-base32';
import { TOTP } from 'otpauth';
import * as QRCode from 'qrcode';

import { User } from '@/prisma/generated';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import creaTotp from '@/src/shared/utils/create-totp.util';

import { EnableTotpInput } from './inputs/enable-totp.input';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class TotpService {
	constructor(private readonly prismaService: PrismaService) {}

	async generate(user: User) {
		const secret = encode(randomBytes(15))
			.replace(/=/g, '')
			.substring(0, 24);

		const totp = creaTotp(user.email, secret);

		const otpauthUrl = totp.toString();
		const qrcodeUrl = await QRCode.toDataURL(otpauthUrl);
		return { qrcodeUrl, secret };
	}

	async enable(user: User, input: EnableTotpInput) {
		const { secret, pin } = input;

		const totp = creaTotp(user.email, secret);
		const delta = totp.validate({ token: pin });
		if (delta === null) {
			throw new BadRequestException('Code errato');
		}

		await this.prismaService.user.update({
			where: { id: user.id },
			data: { isTotpEnabled: true, totpSecret: secret },
		});

		return true;
	}

	async disable(user: User) {
		await this.prismaService.user.update({
			where: { id: user.id },
			data: { isTotpEnabled: false, totpSecret: null },
		});
		return true;
	}
}
