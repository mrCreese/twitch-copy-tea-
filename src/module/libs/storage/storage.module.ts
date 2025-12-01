import { StorageService } from './storage.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
	controllers: [],
	providers: [StorageService],
	exports: [StorageService],
})
export class StorageModule {}
