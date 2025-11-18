/* import {
	IsNotEmpty,
	IsString,
	IsUUID,
	MinLength,
	Validate,
} from 'class-validator';

import { IsPasswordmatchingConstraint } from '@/src/shared/decatators/is-password-matching-constraint.decorator';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class NewPasswordInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string;

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@Validate(IsPasswordmatchingConstraint)
	passwordRepeat: string;

	@Field(() => String)
	@IsUUID('4')
	@IsNotEmpty()
	token: string;
}
 */
