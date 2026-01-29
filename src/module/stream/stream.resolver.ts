import type { User } from '@/prisma/generated';
import { Authorization } from '@/src/shared/decatators/auth.decorator';
import { Authorized } from '@/src/shared/decatators/authorized.decorator';
import { FileVsalidationPipe } from '@/src/shared/pipes/file-validation.pipe';

import { ChangeStreamInput } from './inputs/change-stream-info.input';
import { FiltersInput } from './inputs/filter.input';
import { GenerateStreamTokenInput } from './inputs/generate-stream-token.input';
import { GenerateStreamTokenModel } from './models/generate-stream-token.model';
import { StreamModel } from './models/stream.model';
import { StreamService } from './stream.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { FileUpload } from 'graphql-upload/processRequest.mjs';

@Resolver('Stream')
export class StreamResolver {
	constructor(private readonly streamService: StreamService) {}

	@Query(() => [StreamModel], { name: 'findAllStreams' })
	async findAll(@Args('filters') input: FiltersInput) {
		return this.streamService.findAll(input);
	}

	@Query(() => [StreamModel], { name: 'findRandomStreams' })
	async findRandom() {
		return this.streamService.findRandom();
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeStreamInfo' })
	async changeInfo(
		@Authorized() user: User,
		@Args('data') input: ChangeStreamInput,
	) {
		return this.streamService.changeInfo(user, input);
	}
	@Authorization()
	@Mutation(() => Boolean, { name: 'changeStreamThumbnail' })
	async changeThumbnail(
		@Authorized() user: User,
		@Args('thumbnail', { type: () => GraphQLUpload }, FileVsalidationPipe)
		thumbnail: FileUpload,
	) {
		return this.streamService.changeThumbnail(user, thumbnail);
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeStreamThumbnail' })
	async removeThumbnail(@Authorized() user: User) {
		return this.streamService.removeThumbnail(user);
	}

	@Mutation(() => GenerateStreamTokenModel, { name: 'generateSteamToken' })
	async generateToken(@Args('data') input: GenerateStreamTokenInput) {
		return this.streamService.generateStreamToken(input);
	}
}
