import { LivekitService } from './livekit.service';
import {
	LiveKitOptionsSymbol,
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
}
