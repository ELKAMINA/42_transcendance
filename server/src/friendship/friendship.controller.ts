import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';

import { FriendshipService } from './friendship.service';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  async createReqFriendship(senderLogin: string, receiverLogin: string) {
    this.friendshipService.requestFriendship(senderLogin, receiverLogin);
  }

  @Post('/all')
  async getAllFriendsReq(userLogin: string) {
    return this.friendshipService.getAllFriendReq(userLogin);
  }

  async addFriend(senderLogin: string, receiverLogin: string) {
    this.friendshipService.addFriend(senderLogin, receiverLogin);
  }
}
