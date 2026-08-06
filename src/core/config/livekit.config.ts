import type { TypeLiveKitOptions } from '@/src/module/libs/livekit/types/livekit.types';

import { ConfigService } from '@nestjs/config';

export function getLiveKitConfig(
	configService: ConfigService,
): TypeLiveKitOptions {
	return {
		apiUrl: configService.getOrThrow('LIVEKIT_API_URL'),
		apiKey: configService.getOrThrow('LIVEKIT_API_KEY'),
		apiSecret: configService.getOrThrow('LIVEKIT_API_SECRET'),
	};
}
