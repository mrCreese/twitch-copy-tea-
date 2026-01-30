import { FollowResolver } from './follow.resolver';
import { FollowService } from './follow.service';
import { Module } from '@nestjs/common';

@Module({
	providers: [FollowResolver, FollowService],
})
export class FollowModule {}
