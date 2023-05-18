import { Get, UseGuards, Controller, Body, Post, HttpStatus, HttpCode, Response, Redirect } from '@nestjs/common';
import { Request } from 'express';
import { Req, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HomeService } from './home.service';


@Controller('home')
@ApiTags('home')
export class HomeController {
  constructor(private HomeService: HomeService) {}

 /* Simple Login Strategy */  
  @Get('/')
  hommie(){
    return 'Welcome';
  }


}

//Notes:
//Pipes are function that transform our data
// }