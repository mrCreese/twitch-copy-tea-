import { User } from '@/prisma/generated';
import { Authorization } from '@/src/shared/decatators/auth.decorator';
import { Authorized } from '@/src/shared/decatators/authorized.decorator';

import { CreatePlanInput } from './inputs/create-plan.input';
import { PlanModel } from './models/plan.model';
import { PlanService } from './plan.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver('Plan')
export class PlanResolver {
	constructor(private readonly planService: PlanService) {}

	@Authorization()
	@Query(() => [PlanModel], { name: 'findMySponsorshipPlans' })
	async findMyPlans(@Authorized() user: User) {
		return this.planService.findMyPlans(user);
	}
	@Authorization()
	@Mutation(() => Boolean, { name: 'createSponsorshipPlan' })
	async create(
		@Authorized() user: User,
		@Args('data') input: CreatePlanInput,
	) {
		return this.planService.create(user, input);
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeSponsorshipPlan' })
	async remove(@Args('planId') planid: string) {
		return this.planService.remove(planid);
	}
}
