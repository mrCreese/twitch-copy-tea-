import type { IngressInput } from 'livekit-server-sdk';

import type { User } from '@/prisma/generated';
import { Authorization } from '@/src/shared/decatators/auth.decorator';
import { Authorized } from '@/src/shared/decatators/authorized.decorator';

import { IngressService } from './ingress.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

@Resolver('Ingress')
export class IngressResolver {
	constructor(private readonly ingressService: IngressService) {}

	@Authorization()
	@Mutation(() => Boolean, { name: 'createIngress' })
	async create(
		@Authorized() user: User,
		@Args('ingressType') ingressType: IngressInput,
	) {
		return this.ingressService.create(user, ingressType);
	}
}
