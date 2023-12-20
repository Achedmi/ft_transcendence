import { SubscribeMessage, WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from 'src/game/game.service';

@WebSocketGateway({ namespace: '/game', cors: true, origins: 'http://localhost:6969' })
export class GameGateway {
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server: Server;

  readyToPlayQueue: {
    [userId: number]: string;
  } = {};

  afterInit(server: Server) {
    console.log('Game Socket initialized');
  }

  handleConnection(client: Socket) {
    console.log('New client connected to Game socket: ', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected from Game socket: ', client.id);
  }

  @SubscribeMessage('readyToPlay')
  async readyToPlay(client: Socket, data: { userId: number }) {
    console.log(client.id, 'joining game: ', data.userId);
    this.readyToPlayQueue[data.userId] = client.id;
    if (Object.keys(this.readyToPlayQueue).length >= 2) {
      const gameId = (
        await this.gameService.create({
          players: Object.keys(this.readyToPlayQueue).map((userId) => +userId),
        })
      ).id;
      const game = Object.keys(this.readyToPlayQueue).map((userId) => ({
        userId: +userId,
        socketId: this.readyToPlayQueue[userId],
        gameId,
      }));
      this.readyToPlayQueue = {};
      client.join(String(gameId));
      this.server.to(String(gameId)).emit('gameIsReady', game);
    }
  }
}
