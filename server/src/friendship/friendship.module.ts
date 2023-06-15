import { Module } from '@nestjs/common';
import { FriendshipGateway } from './friendship.gateway';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';

@Module({
  imports: [],
  controllers: [FriendshipController],
  providers: [FriendshipService, FriendshipGateway],
})
export class FriendshipModule {}
