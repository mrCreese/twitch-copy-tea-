import { ChatService } from './chat.service';
import { Resolver } from '@nestjs/graphql';

@Resolver('Chat')
export class ChatResolver {
	constructor(private readonly chatService: ChatService) {}
}
