import { Authorization } from '@/src/shared/decatators/auth.decorator';
import { Authorized } from '@/src/shared/decatators/authorized.decoratot';

import { AccountService } from './account.service';
import { CreateUserInput } from './inputs/create-user.input';
import { UserModel } from './models/user.model';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver('Account')
export class AccountResolver {
	public constructor(private readonly accountService: AccountService) {}

	@Authorization()
	@Query(() => UserModel, { name: 'findProfile' })
	public async me(@Authorized('id') id: string) {
		return this.accountService.me(id);
	}
	@Mutation(() => Boolean, { name: 'createUser' })
	async create(@Args('data') input: CreateUserInput) {
		return this.accountService.create(input);
	}
	/* 
	@Query(() => [UserModel], { name: 'findAllUsers' })
	async findAll() {
		return this.accountService.findAll();
	} */
}
