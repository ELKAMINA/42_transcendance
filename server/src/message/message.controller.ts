import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { MessageService } from '../message/message.service';

@Controller('message')
@ApiTags('message')
export class MessageController {
  constructor(private MessageService: MessageService, private prismaService: PrismaService) {}


}
