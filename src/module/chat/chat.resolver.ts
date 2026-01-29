import { PubSub } from 'graphql-subscriptions';

import { User } from '@/prisma/generated';
import { Authorization } from '@/src/shared/decatators/auth.decorator';
import { Authorized } from '@/src/shared/decatators/authorized.decorator';

import { ChatService } from './chat.service';
import { ChangeChatSettingsInput } from './inputs/change-chat-settings.input';
import { SendMessageInput } from './inputs/send-message.input';
import { ChatMessageModel } from './models/chat-message.model';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';

@Resolver('Chat')
export class ChatResolver {
	private readonly pubSub: PubSub;
	constructor(private readonly chatService: ChatService) {}

	@Query(() => [ChatMessageModel], { name: 'findChatMessagesByStream' })
	async findByStream(@Args('streamId') streamId: string) {
		return this.chatService.findMessagesByStream(streamId);
	}

	@Authorization()
	@Mutation(() => ChatMessageModel, { name: 'sendMessage' })
	async sendMessage(
		@Authorized('id') userId: string,
		@Args('data') input: SendMessageInput,
	) {
		console.log(input);
		const message = await this.chatService.sendMessage(userId, input);
		this.pubSub
			.publish('CHAT_MESSAGE_ADDED', {
				chatMessageAdded: message,
			})
			.catch(err => {
				console.error('PubSub publish failed', err);
			});

		return message;
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeChatSettings' })
	async changeSettings(
		@Authorized() user: User,
		@Args('data') input: ChangeChatSettingsInput,
	) {
		return this.chatService.changeSettings(user, input);
	}

	@Subscription(() => ChatMessageModel, {
		name: 'chatMessageAdded',
		filter: (payload, variables) => {
			console.log('payload:', payload);
			console.log('variables:', variables);
			return payload.chatMessageAdded.streamId === variables.streamId;
		},
	})
	chatMessageAdded(@Args('streamId') streamId: string) {
		return this.pubSub.asyncIterableIterator('CHAT_MESSAGE_ADDED');
	}
}
