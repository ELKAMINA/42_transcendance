import { Controller, Get } from '@nestjs/common';
import { GlobalService } from './global.service';

@Controller('global')
export class GlobalController {
    constructor(private globalServ: GlobalService) {}

@Get('totalPlayers')
async getTotalPlayers(){
    return this.globalServ.geTotalPlayer();
}
}
