import { SubscribeMessage, WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/game' })
export class GameGateway {
  @WebSocketServer()
  server: Server;

  readyToPlayQueue: {
    [userId: number]: string;
  } = {};

  //

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
  joinGame(client: Socket, data: { userId: number }) {
    console.log(client.id, 'joining game: ', data.userId);
    this.readyToPlayQueue[data.userId] = client.id;
    if (Object.keys(this.readyToPlayQueue).length >= 2) {
      const players = Object.keys(this.readyToPlayQueue).map((userId) => ({
        userId: userId,
        socketId: this.readyToPlayQueue[userId],
      }));
      this.server.to(players[0].socketId).emit('startGame', players);
      this.server.to(players[1].socketId).emit('startGame', players);
      this.readyToPlayQueue = {};
    }
  }
}
