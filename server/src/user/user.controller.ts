import { Get, Body, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators';
import { Query } from '@nestjs/common';
import { Redirect } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/all')
  findAll() {
    return this.userService.findAll();
  }

  @Public()
  @Get('/userprofile')
  getUserProfile(@Query() query: Record<string, any>) {
    return this.userService.getUserProfile(query);
  }

  @Post('/me')
  getActualUser(@Body() body) {
    return this.userService.getActualUser(body);
  }

  updateData(nickName: string, dataToUpdate: any) {
    return this.userService.updateData(nickName, dataToUpdate);
  }
}
