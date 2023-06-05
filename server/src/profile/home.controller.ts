import { ApiTags } from '@nestjs/swagger';
import { Get, Controller } from '@nestjs/common';

@Controller('home')
@ApiTags('home')
export class HomeController {
  /* Simple Login Strategy */
  @Get('/')
  hommie() {
    return 'Welcome';
  }
}
