import { FiltersInput } from './inputs/filter.input';
import { StreamModel } from './models/stream.model';
import { StreamService } from './stream.service';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver('Stream')
export class StreamResolver {
	constructor(private readonly streamService: StreamService) {}

	@Query(() => [StreamModel], { name: 'findAllStreams' })
	async findAll(@Args('filters') input: FiltersInput) {
		return this.streamService.findAll(input);
	}
}
