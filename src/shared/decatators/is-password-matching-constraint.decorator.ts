import {
	type ValidationArguments,
	ValidatorConstraint,
	type ValidatorConstraintInterface,
} from 'class-validator';

import { NewPasswordInput } from '@/src/module/auth/password-recovery/inputs/new-password.input';

@ValidatorConstraint({ name: 'isPasswordMatching', async: false })
export class IsPasswordmatchingConstraint
	implements ValidatorConstraintInterface
{
	validate(passwordRepeat: string, args: ValidationArguments) {
		const obj = args.object as NewPasswordInput;

		return obj.password === passwordRepeat;
	}
	defaultMessage(validationArguments?: ValidationArguments): string {
		return 'Password non sono uguali';
	}
}
