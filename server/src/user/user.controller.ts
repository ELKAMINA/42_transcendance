import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators';
import { Query } from '@nestjs/common';
import { Redirect } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/all')
  @Public()
  findAll() {
    return this.userService.findAll();
  }

  @Get('/userprofile')
  @Public()
  getUserProfile(@Query() query: Record<string, any>) {
    return this.userService.getUserProfile(query);
  }
}
