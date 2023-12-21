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

  async handleDisconnect(client) {
    console.log('Client disconnected from Game socket: ', client.id);

    // console.log('userId disconnected :', client.userId);
    // console.log('gameId :', client.gameId);

    if (client.userId) await this.updateUserStatus(client.userId, Status.STARTINGGAME, client.id);

    //if the user disconnected and still on the queuee, remove him from the readyToPlayQueue
    const userId = Object.keys(this.readyToPlayQueue).find((userId) => this.readyToPlayQueue[userId]?.id === client.id);
    if (userId) delete this.readyToPlayQueue[userId];
  }

  async updateUserStatus(userId: number, status: Status, clientId: string) {
    await this.userService.updateUserStatus(userId, status);
    this.server.to(clientId).emit('updateStatus', status);
  }

  @SubscribeMessage('readyToPlay')
  async readyToPlay(client: Socket, data: { userId: number }) {
    console.log('readyToPlay', data.userId);
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
          socketId: this.readyToPlayQueue[Object.keys(this.readyToPlayQueue)[0]].id,
          score: 0,
        },
        player2: {
          userId: +Object.keys(this.readyToPlayQueue)[1],
          socketId: this.readyToPlayQueue[Object.keys(this.readyToPlayQueue)[1]].id,
          score: 0,
        },
        gameId,
      };

      //add the gameId to the socket
      this.readyToPlayQueue[game.player1.userId].gameId = gameId;
      this.readyToPlayQueue[game.player2.userId].gameId = gameId;

      //add the userId to the socket
      this.readyToPlayQueue[game.player1.userId].userId = game.player1.userId;
      this.readyToPlayQueue[game.player2.userId].userId = game.player2.userId;

      //joing the clients to the game room
      this.readyToPlayQueue[game.player1.userId].join(String(gameId));
      this.readyToPlayQueue[game.player2.userId].join(String(gameId));
      this.server.to(String(gameId)).emit('gameIsReady', game);

      //save the game object in the games
      this.games[gameId] = game;

      //clear the readyToPlayQueue
      this.readyToPlayQueue = {};

      //update the users status to INGAME
      await this.updateUserStatus(game.player1.userId, Status.STARTINGGAME, game.player1.socketId);
      await this.updateUserStatus(game.player2.userId, Status.STARTINGGAME, game.player2.socketId);

      //start the game countdown
      this.startGameCountdown(game);
    }
  }

  startGameCountdown(game) {
    let count = 5;
    const interval = setInterval(async () => {
      this.server.to(String(game.gameId)).emit('countdown', count);
      if (count === 0) {
        clearInterval(interval);
        await this.updateUserStatus(game.player1.userId, Status.INGAME, game.player1.socketId);
        await this.updateUserStatus(game.player2.userId, Status.INGAME, game.player2.socketId);
        this.startGame(game);
      }
      count--;
    }, 1000);
  }

  async startGame(game) {
    setInterval(() => {
      this.server.to(String(game.gameId)).emit('gameUpdates', game);
    }, 1000 / 60);
  }

  @SubscribeMessage('incrementScore')
  incrementScore(client: Socket, data: { userId: number; gameId: number }) {
    console.log(data);
    if (this.games[data.gameId].player1.userId === data.userId) this.games[data.gameId].player1.score++;
    else this.games[data.gameId].player2.score++;
  }
  @SubscribeMessage('setMeOnline')
  setMeOnline(client: Socket, data: { userId: number }) {
    this.updateUserStatus(data.userId, Status.ONLINE, client.id);
  }

  @SubscribeMessage('toggleOnline')
  async toggleOnline(client: Socket, data: { userId: number }) {
    const userStatus = (await this.userService.findUnique({ id: data.userId })).status;
    if (userStatus === Status.ONLINE) this.updateUserStatus(data.userId, Status.OFFLINE, client.id);
    else this.updateUserStatus(data.userId, Status.ONLINE, client.id);
  }
}
