import { TelegrafModuleOptions } from 'nestjs-telegraf';

import { ConfigService } from '@nestjs/config';

export function getTelegrafConfig(
	consfigService: ConfigService,
): TelegrafModuleOptions {
	return { token: consfigService.getOrThrow<string>('TELEGRAM_BOT_TOKEN') };
}
