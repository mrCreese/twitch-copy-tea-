import { IsNumber, IsOptional, IsString } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FiltersInput {
	@Field(() => Number, { nullable: true })
	@IsNumber()
	@IsOptional()
	take?: number;

	@Field(() => Number, { nullable: true })
	@IsNumber()
	@IsOptional()
	skip?: number;

	@Field(() => String, { nullable: true })
	@IsString()
	@IsOptional()
	searchTerm?: string;
}
