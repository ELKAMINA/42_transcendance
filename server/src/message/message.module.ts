import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
	imports: [], 
	providers: [MessageService],
	controllers: [MessageController],
})
export default class MessageModule {}