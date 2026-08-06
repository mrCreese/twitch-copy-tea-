import { UserModel } from '@/src/module/auth/account/models/user.model';

import { SubscriptionModel } from '../sponsorship/subscription/models/subscription.model';

import { ChannelService } from './channel.service';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver('Channel')
export class ChannelResolver {
	constructor(private readonly channelService: ChannelService) {}

	@Query(() => [UserModel], { name: 'findRecommendedChannels' })
	async findRecommendedChannels() {
		return this.channelService.findRecommendedChannels();
	}

	@Query(() => UserModel, { name: 'findChannelByUsername' })
	async findByUsername(@Args('username') username: string) {
		return this.channelService.findByUsername(username);
	}

	@Query(() => Number, { name: 'findFollowersCountByChannel' })
	async findFollowersCountByChannel(@Args('channelId') channelId: string) {
		return this.channelService.findFollowersCountByChannel(channelId);
	}

	@Query(() => [SubscriptionModel], { name: 'findSponsorsByChannel' })
	async findMySponsors(@Args('channelId') channelId: string) {
		return this.channelService.findSponsorsByChannel(channelId);
	}
}
