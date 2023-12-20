import { SubscribeMessage, WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from 'src/game/game.service';

@WebSocketGateway({ namespace: '/game', cors: true, origins: 'http://localhost:6969' })
export class GameGateway {
  constructor(private readonly gameService: GameService) {}

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

  @SubscribeMessage('readyToPlay')
  async readyToPlay(client: Socket, data: { userId: number }) {
    console.log(client.id, 'joining game: ', data.userId);
    this.readyToPlayQueue[data.userId] = client;
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

      //start the game
      this.startGame(this.games[gameId]);
    }
  }

  startGame(game) {
    setInterval(() => {
      this.server.to(String(game.gameId)).emit('gameUpdate', game);
    }, 2000);
  }

  @SubscribeMessage('uncrementScore')
  updateScore(client: Socket, data: { userId: number; score: number; gameId: number }) {
    if (this.games[data.gameId].player1.userId === data.userId) this.games[data.gameId].player1.score++;
    else this.games[data.gameId].player2.score++;
  }
}
