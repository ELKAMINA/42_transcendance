
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
