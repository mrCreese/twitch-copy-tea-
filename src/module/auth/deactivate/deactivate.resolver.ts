import { User } from '@/prisma/generated';
import { Authorization } from '@/src/shared/decatators/auth.decorator';
import { Authorized } from '@/src/shared/decatators/authorized.decoratot';
import { UserAgent } from '@/src/shared/decatators/userAgent.decorator';
import { GqlContext } from '@/src/shared/types/gql-context.types';

import { AuthModel } from '../account/models/auth.model';

import { DeactivateService } from './deactivate.service';
import { DeactivateAccountInput } from './inputs/deactivate-account.input';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

@Resolver('Deactivate')
export class DeactivateResolver {
	constructor(private readonly deactivateService: DeactivateService) {}

	@Authorization()
	@Mutation(() => AuthModel, { name: 'deactivateAccount' })
	async deactivate(
		@Context() { req }: GqlContext,
		@Args('data') input: DeactivateAccountInput,
		@Authorized() user: User,
		@UserAgent() userAgent: string,
	) {
		return this.deactivateService.deactivate(req, input, user, userAgent);
	}
}
