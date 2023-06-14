
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [JwtModule.register({})],
  providers: [ChatGateway],
})
export class ChatModule {}
