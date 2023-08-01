
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { ChatService } from './chat.service';
import { FriendshipService } from '../friendship/friendship.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [ChatGateway, ChatService, FriendshipService],
})
export class ChatModule {}
