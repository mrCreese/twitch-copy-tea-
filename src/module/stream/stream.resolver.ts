import { StreamModel } from './models/stream.model';
import { StreamService } from './stream.service';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver('Stream')
export class StreamResolver {
	constructor(private readonly streamService: StreamService) {}

	@Query(() => [StreamModel], { name: 'findAllStreams' })
	async findAll() {
		return this.streamService.findAll();
	}
}
