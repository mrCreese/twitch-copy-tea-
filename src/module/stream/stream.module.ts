import { StreamResolver } from './stream.resolver';
import { StreamService } from './stream.service';
import { Module } from '@nestjs/common';

@Module({
	providers: [StreamResolver, StreamService],
})
export class StreamModule {}
