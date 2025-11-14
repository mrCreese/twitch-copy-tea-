import type { Request } from 'express';
import { lookup } from 'geoip-lite';
import * as countries from 'i18n-iso-countries';

import type { SessionMetadata } from '../types/session-metadata.types';

import { IS_DEV_ENV } from './is-dev.util';

import DeviceDetector = require('device-detector-js');

countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

const connectingIp = 'cf-connecting-ip';
const xForwarded = 'x-forwarded-for';
const defaultValue = 'Sconosciuto';

export function getSessionMetadata(
	req: Request,
	userAgent: string,
): SessionMetadata {
	const ip = IS_DEV_ENV
		? '173.166.164.121'
		: Array.isArray(req.headers[connectingIp])
			? req.headers[connectingIp][0]
			: req.headers[connectingIp] ||
				(typeof req.headers[xForwarded] === 'string'
					? req.headers[xForwarded].split(',')[0]
					: req.ip);

	const location = lookup(ip || '');
	const device = new DeviceDetector().parse(userAgent);

	return {
		location: {
			country:
				countries.getName(location?.country || defaultValue, 'en') ||
				defaultValue,
			city: location?.city || defaultValue,
			latidute: location?.ll[0] || 0,
			longitude: location?.ll[1] || 0,
		},
		device: {
			browser: device.client?.name || defaultValue,
			os: device.os?.name || defaultValue,
			type: device.device?.type || defaultValue,
		},
		ip: ip || defaultValue,
	};
}
