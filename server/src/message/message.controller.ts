import { Body, Get, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageDto } from './dto/messagePayload.dto';

import { MessageService } from 'src/message/message.service';

@Controller('message')
@ApiTags('message')
export class MessageController {
  constructor(private MessageService: MessageService, private prismaService: PrismaService) {}


}
