import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessageDto } from '../chat/dto/messagePayload.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChatService {
	constructor(
		private prisma: PrismaService) {}

		async createMessage(dto: MessageDto): Promise<void> {

			// console.log('dto received, it is : ', dto.sentTo);

			try {
				const creator = await this.prisma.user.findUnique({
					where: { login: dto.sentBy },
				});
				if (!creator) {
					throw new NotFoundException(`User with login '${dto.sentBy}' not found.`);
				}

				// we create message record
				const message = await this.prisma.message.create({
					data: {
						sentBy: { connect: {login: dto.sentBy} },
						message: dto.message,
						sentAt: dto.sentAt,
						img: dto.img,
						preview: dto.preview,
						incoming: dto.incoming,
						outgoing: dto.outgoing,
						subtype: dto.subtype,
						reply: dto.reply,
						channel: {
							connect: {name: dto.channel}
						}
					} as Prisma.MessageCreateInput,
				});
				console.log('this message has been added to the database : ', message)
			} catch (error: any) {
					console.log('error is : ', error)
					throw error;
			}
		}
}
