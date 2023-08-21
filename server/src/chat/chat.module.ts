import { JwtModule } from '@nestjs/jwt';
import { Global, Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { ChatService } from './chat.service';
import { FriendshipService } from '../friendship/friendship.service';
import { UserService } from '../user/user.service';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [ChatGateway, ChatService, FriendshipService, UserService],
  exports: [ChatGateway],
})
export class ChatModule {}
