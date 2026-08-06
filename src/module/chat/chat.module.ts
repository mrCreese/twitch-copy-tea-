import { PubSubProvider } from '../libs/pubsub/pubsub.provider';

import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { Module } from '@nestjs/common';

@Module({
	providers: [ChatResolver, ChatService, PubSubProvider],
})
export class ChatModule {}
