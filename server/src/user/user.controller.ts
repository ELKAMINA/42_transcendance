import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from 'src/user/user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/all')
  findAll() {
    return this.userService.findAll();
  }

  addFriend(senderId: string, receiverId: string) {
    return this.userService.addFriend(senderId, receiverId);
  }
}
