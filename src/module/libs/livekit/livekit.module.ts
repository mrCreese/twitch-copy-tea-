import { LivekitService } from './livekit.service';
import {
	LiveKitOptionsSymbol,
	TypeLiveKitAsyncOptions,
	type TypeLiveKitOptions,
} from './types/livekit.types';
import { type DynamicModule, Module } from '@nestjs/common';

@Module({})
export class LivekitModule {
	static register(options: TypeLiveKitOptions): DynamicModule {
		return {
			module: LivekitModule,
			providers: [{ provide: LiveKitOptionsSymbol, useValue: options }],
			exports: [LivekitService],
			global: true,
		};
	}

	static registerAsync(options: TypeLiveKitAsyncOptions): DynamicModule {
		return {
			module: LivekitModule,
			imports: options.imports || [],
			providers: [
				{
					provide: LiveKitOptionsSymbol,
					useFactory: options.useFactory,
					inject: options.inject || [],
				},
			],
			exports: [LivekitService],
			global: true,
		};
	}
}
