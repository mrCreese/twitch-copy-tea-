import { TOTP } from 'otpauth';

export default function creaTotp(email: string, secret: string | undefined) {
	const totp = new TOTP({
		issuer: 'CreeseStream',
		label: `${email}`,
		algorithm: 'SHA1',
		digits: 6,
		secret,
		//	period: 240, // periodo di validita
	});
	console.log(totp.generate());
	return totp;
}
