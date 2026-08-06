import type { User } from '@/prisma/generated';
import { Authorization } from '@/src/shared/decatators/auth.decorator';
import { Authorized } from '@/src/shared/decatators/authorized.decorator';

import { MakePaymentModel } from './models/make-payment.model';
import { TransactionModel } from './models/transaction.model';
import { TransactionService } from './transaction.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver('Transaction')
export class TransactionResolver {
	constructor(private readonly transactionService: TransactionService) {}

	@Authorization()
	@Query(() => [TransactionModel], {
		name: 'findMyTransactions',
	})
	async findMyTransactions(@Authorized() user: User) {
		return this.transactionService.findMyTransactions(user);
	}

	@Authorization()
	@Mutation(() => MakePaymentModel, { name: 'makePayment' })
	async makePayment(
		@Authorized() user: User,
		@Args('planId') planId: string,
	) {
		return this.transactionService.makePayment(user, planId);
	}
}
