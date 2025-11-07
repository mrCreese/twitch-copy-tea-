import Redis from 'ioredis';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService extends Redis {
	public constructor(private readonly configService: ConfigService) {
		super({
			host: configService.get<string>('REDIS_HOST'),
			port: Number(configService.get<string>('REDIS_PORT')),
			password: configService.get<string>('REDIS_PASSWORD'), // SOLO password
		});
		this.on('connect', () => console.log('✅ Connected to Redis'));
		this.on('ready', () => console.log('✅ Redis ready'));
		this.on('error', err => console.error('❌ Redis error:', err));
	}
}
