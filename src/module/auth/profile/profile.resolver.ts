import type { User } from '@/prisma/generated';
import { Authorization } from '@/src/shared/decatators/auth.decorator';
import { Authorized } from '@/src/shared/decatators/authorized.decoratot';
import { FileVsalidationPipe } from '@/src/shared/pipes/file-validation.pipe';

import { ChangeProfileInfoInput } from './inputs/change-profile-info.input';
import { ProfileService } from './profile.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { FileUpload } from 'graphql-upload/processRequest.mjs';

@Resolver('Profile')
export class ProfileResolver {
	constructor(private readonly profileService: ProfileService) {}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeProfileAvatar' })
	async changeAvatar(
		@Authorized() user: User,
		@Args('avatar', { type: () => GraphQLUpload }, FileVsalidationPipe)
		avatar: FileUpload,
	) {
		return this.profileService.changeAvatar(user, avatar);
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeProfileAvatar' })
	async removeAvatar(@Authorized() user: User) {
		return this.profileService.removeAvatar(user);
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeProfileInfo' })
	async changeInfo(
		@Authorized() user: User,
		@Args('data') input: ChangeProfileInfoInput,
	) {
		return this.profileService.changeInfo(user, input);
	}
}
