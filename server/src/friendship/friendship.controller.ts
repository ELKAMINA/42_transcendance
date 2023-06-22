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

  async addFriend(senderLogin: string, receiverLogin: string) {
    this.friendshipService.addFriend(senderLogin, receiverLogin);
  }
}
