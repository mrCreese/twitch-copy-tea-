import { IsNotEmpty, IsString } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SendMessageInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	text: string;

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	streamId: string;
}
