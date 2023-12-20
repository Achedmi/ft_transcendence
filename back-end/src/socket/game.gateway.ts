import { SubscribeMessage, WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { Status } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { GameService } from 'src/game/game.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({ namespace: '/game', cors: true, origins: 'http://localhost:6969' })
export class GameGateway {
  constructor(private readonly gameService: GameService, private readonly userService: UserService) {}

  @WebSocketServer()
  server: Server;

  private readyToPlayQueue = {};

  private games: {
    [gameId: number]: {
      player1: {
        userId: number;
        socketId: string;
        score: number;
      };
      player2: {
        userId: number;
        socketId: string;
        score: number;
      };
      gameId: number;
    };
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

  async updateUserStatus(userId: number, status: Status, clientId: string) {
    await this.userService.updateUserStatus(userId, status);
    this.server.to(clientId).emit('updateStatus', status);
  }

  @SubscribeMessage('readyToPlay')
  async readyToPlay(client: Socket, data: { userId: number }) {
    this.readyToPlayQueue[data.userId] = client;

    await this.updateUserStatus(data.userId, Status.INQUEUE, client.id);
    if (Object.keys(this.readyToPlayQueue).length >= 2) {
      //create game in DB
      const gameId = (
        await this.gameService.create({
          players: Object.keys(this.readyToPlayQueue).map((userId) => +userId),
        })
      ).id;

      //create game object
      const game = {
        player1: {
          userId: +Object.keys(this.readyToPlayQueue)[0],
          socketId: this.readyToPlayQueue[Object.keys(this.readyToPlayQueue)[0]],
          score: 0,
        },
        player2: {
          userId: +Object.keys(this.readyToPlayQueue)[1],
          socketId: this.readyToPlayQueue[Object.keys(this.readyToPlayQueue)[1]],
          score: 0,
        },
        gameId,
      };

      //joing the clients to the game room
      this.readyToPlayQueue[game.player1.userId].join(String(gameId));
      this.readyToPlayQueue[game.player2.userId].join(String(gameId));
      this.server.to(String(gameId)).emit('gameIsReady', game);

      //save the game object in the games
      this.games[gameId] = game;

      //clear the readyToPlayQueue
      this.readyToPlayQueue = {};

      //update the users status to INGAME
      await this.updateUserStatus(game.player1.userId, Status.INGAME, game.player1.socketId);
      await this.updateUserStatus(game.player2.userId, Status.INGAME, game.player2.socketId);

      //start the game countdown
      this.startGameCountdown(game);
    }
  }

  startGameCountdown(game) {
    let count = 5;
    const interval = setInterval(() => {
      this.server.to(String(game.gameId)).emit('countdown', count);
      count--;
      if (count === 0) {
        clearInterval(interval);
        this.startGame(game);
      }
    }, 1000);
  }

  startGame(game) {
    setInterval(() => {
      this.server.to(String(game.gameId)).emit('gameUpdates', game);
    }, 2000);
  }

  @SubscribeMessage('uncrementScore')
  updateScore(client: Socket, data: { userId: number; score: number; gameId: number }) {
    if (this.games[data.gameId].player1.userId === data.userId) this.games[data.gameId].player1.score++;
    else this.games[data.gameId].player2.score++;
  }
}
