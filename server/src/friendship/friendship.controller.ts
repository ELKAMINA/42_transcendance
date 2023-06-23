import { Body } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';

import { FriendshipService } from './friendship.service';
import { FriendshipDto } from './dto';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  async createReqFriendship(senderLogin: string, receiverLogin: string) {
    this.friendshipService.requestFriendship(senderLogin, receiverLogin);
  }

  @Post('/allRequests')
  async getAllFriendsReq(@Body() body: FriendshipDto) {
    const users = await this.friendshipService.getAllFriendReq(body.nickname);
    return users;
  }

  @Post('/allFriends')
  async getAllFriends(@Body() body: FriendshipDto) {
    const users = await this.friendshipService.getAllFriends(body.nickname);
    return users;
  }

  @Post('/blockedFriends')
  async getAllBlockedFriends(@Body() body: FriendshipDto) {
    const users = await this.friendshipService.getAllBlockedFriends(
      body.nickname,
    );
    return users;
  }

  async acceptFriend(senderLogin: string, receiverLogin: string) {
    const user = await this.friendshipService.acceptFriend(
      senderLogin,
      receiverLogin,
    );
    return user;
  }

  async denyFriend(senderLogin: string, receiverLogin: string) {
    const user = await this.friendshipService.denyFriend(
      senderLogin,
      receiverLogin,
    );
    return user;
  }

  async blockFriend(senderLogin: string, receiverLogin: string) {
    const user = await this.friendshipService.blockFriend(
      senderLogin,
      receiverLogin,
    );
    return user;
  }
}
