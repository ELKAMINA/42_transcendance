import { Module } from '@nestjs/common';
import { GlobalService } from './global.service';

@Module({
    imports: [],
    providers: [GlobalService],
    controllers: [],
})
export class GlobalModule {}
