import { IsNotEmpty, IsString } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GenerateStreamTokenInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	userId: string;

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	channelId: string;
}
