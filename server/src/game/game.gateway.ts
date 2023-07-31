import {
  Injectable,
  Logger,
  UnauthorizedException,
  Res,
  ForbiddenException,
} from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UserService } from 'src/user/user.service';
import { FriendshipGateway } from 'src/friendship/friendship.gateway';
import { GameService } from './game.service';

@WebSocketGateway(4010, { cors: '*' })
@Injectable()
export class GameGateway {
  constructor(
    private userService: UserService,
    private friendshipGateway: FriendshipGateway,
    private gameService: GameService,
  ) {}
}
