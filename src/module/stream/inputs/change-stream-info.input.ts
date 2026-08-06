import { IsNotEmpty, IsString } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChangeStreamInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	title: string;

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	categoryId: string;
}
