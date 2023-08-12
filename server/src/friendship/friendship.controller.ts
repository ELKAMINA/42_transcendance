import { Body, HttpException } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';

import { FriendshipService } from './friendship.service';
import { FriendshipDto } from './dto';
import { HttpStatusCode } from 'axios';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  async createReqFriendship(senderLogin: string, receiverLogin: string) {
    this.friendshipService.requestFriendship(senderLogin, receiverLogin);
  }

  @Post('/receivedRequests')
  async getFriendsReqReceived(@Body() body: FriendshipDto) {
    try {
      const users = await this.friendshipService.getFriendReqReceived(
        body.nickname,
      );
      return users;
    } catch (e) {
      throw new HttpException('Error ', HttpStatusCode.Forbidden);
    }
  }

  @Post('/sentRequests')
  async getFriendsReqSent(@Body() body: FriendshipDto) {
    try {
      const users = await this.friendshipService.getFriendReqSent(
        body.nickname,
      );
      return users;
    } catch (e) {
      throw new HttpException('Error ', HttpStatusCode.Forbidden);
    }
  }

  @Post('/allFriends')
  async getAllFriends(@Body() body: FriendshipDto) {
    try {
      const users = await this.friendshipService.getAllFriends(body.nickname);
      return users;
    } catch (e) {
      throw new HttpException('Error ', HttpStatusCode.Forbidden);
    }
  }

  @Post('/blockedFriends')
  async getAllBlockedFriends(@Body() body: FriendshipDto) {
    try {
      const users = await this.friendshipService.getAllBlockedFriends(
        body.nickname,
      );
      return users;
    } catch (e) {
      throw new HttpException('Error ', HttpStatusCode.Forbidden);
    }
  }

  @Post('/suggestions')
  async getFriendSuggestions(@Body() body) {
    try {
      const suggestions = await this.friendshipService.getFriendSuggestions(
        body.nickname,
      );
      return suggestions;
    } catch (e) {
      throw new HttpException('Error ', HttpStatusCode.Forbidden);
    }
  }

  @Post('/ismyfriend')
  async ismyfriend(@Body() body) {
    try {
      const check = await this.friendshipService.ismyfriend(body);
      // console.log('le check des friends et du blocage', check);
      return check;
    } catch (e) {
      throw new HttpException('Error ', HttpStatusCode.Forbidden);
    }
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
