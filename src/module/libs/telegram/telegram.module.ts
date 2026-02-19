import { TelegrafModule } from 'nestjs-telegraf';

import { getTelegrafConfig } from '@/src/core/config/telegraf.config';

import { TelegramService } from './telegram.service';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
	imports: [
		TelegrafModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getTelegrafConfig,
			inject: [ConfigService],
		}),
	],
	providers: [TelegramService],
	exports: [TelegramService],
})
export class TelegramModule {}
