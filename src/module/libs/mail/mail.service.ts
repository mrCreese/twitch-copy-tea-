import type { SessionMetadata } from '@/src/shared/types/session-metadata.types';

import { AccountDeletionTemplate } from './templates/account-deletion.template';
import DeactivateTemplate from './templates/deactivate.template';
import { EnableTwoFacttorTemplate } from './templates/enable-two-factor.template';
import PasswordRecoveryTemplate from './templates/password-recovery.template';
import { VerificationTemplate } from './templates/verification.template';
import { VerifyChannelTemplate } from './templates/verify-channel.template';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';

@Injectable()
export class MailService {
	constructor(
		private readonly maileService: MailerService,
		private readonly configService: ConfigService,
	) {}

	async sendVerificationToken(email: string, token: string): Promise<any> {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
		const html = await render(VerificationTemplate({ domain, token }));

		return this.sendMail(email, 'Verifica account', html);
	}

	async sendResetPasswordToken(
		email: string,
		token: string,
		metadata: SessionMetadata,
	): Promise<any> {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
		const html = await render(
			PasswordRecoveryTemplate({ domain, token, metadata }),
		);

		return this.sendMail(email, 'Reset Password', html);
	}

	async sendDeactivateToken(
		email: string,
		token: string,
		metadata: SessionMetadata,
	): Promise<any> {
		const html = await render(DeactivateTemplate({ token, metadata }));

		return this.sendMail(email, 'Deactivate Account', html);
	}

	async sendAccountDeletion(email: string): Promise<any> {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
		const html = await render(AccountDeletionTemplate({ domain }));

		return this.sendMail(email, 'Account Deleted', html);
	}
	async sendEnableTwoFactor(email: string): Promise<any> {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
		const html = await render(EnableTwoFacttorTemplate({ domain }));

		return this.sendMail(email, 'Aumenta la tua sicurezza', html);
	}

	async sendVerifyChannel(email: string): Promise<any> {
		const html = await render(VerifyChannelTemplate());

		return this.sendMail(email, 'Canale verificato', html);
	}

	private sendMail(email: string, subject: string, html: string) {
		return this.maileService.sendMail({
			to: email,
			subject,
			html,
		});
	}
}
