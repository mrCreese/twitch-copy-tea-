import type { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export function getMailerConfig(confiService: ConfigService): MailerOptions {
	return {
		transport: {
			host: confiService.getOrThrow<string>('MAIL_HOST'),
			port: confiService.getOrThrow<number>('MAIL_PORT'),
			secure: false,
			auth: {
				user: confiService.getOrThrow<number>('MAIL_LOGIN'),
				pass: confiService.getOrThrow<number>('MAIL_PASSWORD'),
			},
			tls: { rejectUnauthorized: false },
		},
		defaults: {
			from: `"CreeseStream" ${confiService.getOrThrow<number>('MAIL_FROM')}`,
		},
	};
}
