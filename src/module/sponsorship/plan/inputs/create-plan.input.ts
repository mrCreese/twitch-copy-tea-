import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePlanInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	title: string;

	@Field(() => String, { nullable: true })
	@IsString()
	@IsOptional()
	description?: string;

	@Field(() => Number)
	@IsNumber()
	@IsNotEmpty()
	price: number;
}
