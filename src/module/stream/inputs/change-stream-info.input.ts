import { IsNegative, IsString } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ChangeStreamInput {
	@Field(() => String)
	@IsString()
	@IsNegative()
	title: string;

	@Field(() => String)
	@IsString()
	@IsNegative()
	categoryId: string;
}
