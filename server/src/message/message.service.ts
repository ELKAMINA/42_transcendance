import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessageDto } from './dto/messagePayload.dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessageService {
	constructor(
		private prisma: PrismaService) {}

}
