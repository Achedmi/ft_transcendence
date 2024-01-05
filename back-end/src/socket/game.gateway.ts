import { SubscribeMessage, WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { GameStatus, Status } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { GameService } from 'src/game/game.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

type Player = {
  socketId: string;
  userId: number;
  score: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

type Ball = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  speed: number;
};
@WebSocketGateway({ namespace: '/game', cors: true, origins: '*' })
export class GameGateway {
  constructor(private readonly gameService: GameService, private readonly userService: UserService, private readonly jwtService: JwtService) {}

  @WebSocketServer()
  server: Server;

  private readyToPlayQueue = {};

  private games: {
    [gameId: number]: {
      player1: Player;
      player2: Player;
      gameId: number;
      status: GameStatus;
      ball: Ball;
    };
  } = {};

  private connectedUsers = {};

  private readonly invites: {
    [userId: number]: string[];
  } = {};

  //==================================================handleConnection==================================================

  async handleConnection(client: Socket) {
    try {
      // const testToken = this.jwtService.sign({ id: client.id }, { secret: 'secret', expiresIn: '1m' });
      // console.log(testToken);
      // const ff = this.jwtService.verify(
      //   'eyJhbGciOiJIUzI1NiIsInR5cCIsdsdf6IkpXVCJ9.eyJpZCI6ImJKcmJ3U3k1eWlQNWVZaTBBQUFCIiwiaWF0IjoxNzAzNDMxNzM3LCJleHAiOjE3MDM0MzE3OTd9.JK3lx4uhImMPrIjrW9fAERgwBDhtuqxK59NteeBRMh8',
      //   { secret: 'secret' },
      // );
      // console.log('=============', ff);

      const token = client.handshake.headers.cookie?.split('userAT=')[1]?.split('; ')[0];
      const isValidToken = this.jwtService.verify(token, { publicKey: process.env.JWT_ACCESS_SECRET });
      if (!isValidToken || this.connectedUsers[isValidToken.id]) {
        console.log('----------', isValidToken?.usernae);
        client.disconnect();
        return;
      }
      const user = await this.userService.findUnique({ id: isValidToken.id });
      console.log('############################################################online', user.username);
      await this.updateUserStatus(user.id, Status.ONLINE, client.id);
      client['user'] = user;
      this.connectedUsers[user.id] = client;

      // console.log('Client connected to Game socket: ', client['user'].username);
    } catch (err) {
      console.log(err);
      client.disconnect();
    }
  }

  //==================================================handleDisconnect==================================================

  async handleDisconnect(client) {
    if (!client.user) return;
    console.log('Client disconnected from Game socket: ', client.user.username);
    delete this.connectedUsers[client.user.id];
    delete this.readyToPlayQueue[client.user.id];
    await this.updateUserStatus(client.user.id, Status.OFFLINE, client.id);
  }

  //==================================================handleDisconnect==================================================

  async updateUserStatus(userId: number, status: Status, clientId: string) {
    await this.userService.updateUserStatus(userId, status);
    this.server.to(clientId).emit('updateStatus', status);
  }

  async handlGameEndOnDisconnect(gameId: number, player1Socket, player2Socket, interval?: NodeJS.Timeout) {
    if (interval) clearInterval(interval);
    if (player1Socket.disconnected || player2Socket.disconnected) {
      await this.gameService.update(gameId, {
        player1Score: player1Socket.disconnected ? 0 : 3,
        player2Score: player2Socket.disconnected ? 0 : 3,
        winnerPlayer: player1Socket.disconnected ? player2Socket.user.id : player1Socket.user.id,
        status: GameStatus.ENDED,
      });
      player1Socket.disconnected
        ? await this.updateUserStatus(player2Socket['user'].id, Status.ONLINE, player2Socket.id)
        : await this.updateUserStatus(player1Socket['user'].id, Status.ONLINE, player1Socket.id);
      this.server.to(String(gameId)).emit('gameEnded', { winner: player1Socket.disconnected ? player2Socket.user.username : player1Socket.user.username });
      return true;
    }
    return false;
  }

  async handlEndGame(game, player1Socket, player2Socket, interval) {
    clearInterval(interval);
    await this.gameService.update(game.gameId, {
      player1Score: game.player1.score,
      player2Score: game.player2.score,
      winnerPlayer: game.player1.score > game.player2.score ? game.player1.userId : game.player2.userId,
      status: GameStatus.ENDED,
    });
    await this.updateUserStatus(player1Socket['user'].id, Status.ONLINE, player1Socket.id);
    await this.updateUserStatus(player2Socket['user'].id, Status.ONLINE, player2Socket.id);
    this.server.to(String(game.gameId)).emit('gameEnded', { winner: game.player1.score > game.player2.score ? player1Socket.user.username : player2Socket.user.username });
  }

  async createGame(player1Socket, player2Socket) {
    const game = await this.gameService.create({
      players: [player1Socket['user'].id, player2Socket['user'].id],
    });
    console.log('GAME CREATED', game.id);

    player1Socket['gameId'] = game.id;
    player2Socket['gameId'] = game.id;

    this.games[game.id] = {
      player1: {
        userId: player1Socket['user'].id,
        socketId: player1Socket.id,
        score: 0,
        x: 0,
        y:  720 / 2 - 60,
        width: 20,
        height: 120,
      },
      player2: {
        userId: player2Socket['user'].id,
        socketId: player2Socket.id,
        score: 0,
        x: 1280 - 20,
        y: 720 / 2 - 60,
        width: 20,
        height: 120,
      },
      gameId: game.id,
      status: GameStatus.ONGOING,
      ball: {
        x: 1280 / 2 - 10,
        y: 720 / 2 - 10,
        dx: Math.random() < 0.5 ? 1 : -1,
        dy: 0,
        size: 20,
        speed: 5,
      },
    };

    player1Socket.join(String(game.id));
    player2Socket.join(String(game.id));

    if (await this.handlGameEndOnDisconnect(game.id, player1Socket, player2Socket)) return;

    if (player1Socket.connected && player2Socket.connected) await this.updateUserStatus(player1Socket['user'].id, Status.INGAME, player1Socket.id);
    if (player1Socket.connected && player2Socket.connected) await this.updateUserStatus(player2Socket['user'].id, Status.INGAME, player2Socket.id);

    if (await this.handlGameEndOnDisconnect(game.id, player1Socket, player2Socket)) return;

    return this.games[game.id];
  }

  @SubscribeMessage('readyToPlay')
  async readyToPlay(client, data: { userId: number }) {
    this.readyToPlayQueue[data.userId] = client;

    await this.updateUserStatus(data.userId, Status.INQUEUE, client.id);

    if (Object.keys(this.readyToPlayQueue).length >= 2) {
      const player1Socket = this.readyToPlayQueue[Object.keys(this.readyToPlayQueue)[0]];
      const player2Socket = this.readyToPlayQueue[Object.keys(this.readyToPlayQueue)[1]];
      this.readyToPlayQueue = {};

      let count = 4;
      const uniqueRoom = String(uuidv4());

      player1Socket.join(uniqueRoom);
      player2Socket.join(uniqueRoom);

      await this.updateUserStatus(player1Socket['user'].id, Status.STARTINGGAME, player1Socket.id);
      await this.updateUserStatus(player2Socket['user'].id, Status.STARTINGGAME, player2Socket.id);

      const interval = setInterval(async () => {
        if (count < 0) {
          clearInterval(interval);
          player1Socket.leave(uniqueRoom);
          player2Socket.leave(uniqueRoom);

          const game = await this.createGame(player1Socket, player2Socket);

          this.startGame(game, player1Socket, player2Socket);

          return;
        } else if (player1Socket.disconnected || player2Socket.disconnected) {
          clearInterval(interval);
          player2Socket.emit('gameEnded');
          player1Socket.emit('gameEnded');
          player1Socket.disconnected
            ? await this.updateUserStatus(player2Socket['user'].id, Status.ONLINE, player2Socket.id)
            : await this.updateUserStatus(player1Socket['user'].id, Status.ONLINE, player1Socket.id);
          player1Socket.leave(uniqueRoom);
          player2Socket.leave(uniqueRoom);
          return;
        }

        this.server.to(uniqueRoom).emit('countdown', count);
        count--;
      }, 1000);
    }
  }

  //
  async startGame(game, player1Socket, player2Socket) {
    this.server.to(String(game.gameId)).emit('gameIsReady', game);

    const interval = setInterval(async () => {
      if (player1Socket.disconnected || player2Socket.disconnected) {
        await this.handlGameEndOnDisconnect(game.gameId, player1Socket, player2Socket, interval);
        return;
      }

      game.ball.x += game.ball.dx * 5;
      game.ball.y += game.ball.dy * 5;

      //check if ball hits player 1
      if (game.ball.x < game.player1.width && game.ball.y >= game.player1.y && game.ball.y <= game.player1.y + 100) {
        game.ball.dx = 1;

        //change ball direction
        if (game.ball.y < game.player1.y + 60) {
          game.ball.dy = -1;
        } else {
          game.ball.dy = 1;
        }
      }

      //check if ball hits player 2
      if (game.ball.x > 1280 - game.player1.width && game.ball.y >= game.player2.y && game.ball.y <= game.player2.y + 100) {
        game.ball.dx = -1;

        //change ball direction
        if (game.ball.y < game.player2.y + 60) {
          game.ball.dy = -1;
        } else {
          game.ball.dy = 1;
        }
      }

      //check if ball hits top or bottom wall
      if (game.ball.y < 0 || game.ball.y > 720 - game.ball.size) {
        game.ball.dy *= -1;
      }

      // check if ball hits left or right wall and reset it if it does
      if (game.ball.x < -20) {
        game.player2.score++;
        game.ball.x = 1280 / 2 - 10;
        game.ball.y = 720 / 2 - 10;
        game.ball.dx = 1;
        game.ball.dy = 1;

        
      } else if (game.ball.x > 1280) {
        game.player1.score++;
        game.ball.x = 1280 / 2 - 10;
        game.ball.y = 720 / 2 - 10;
        game.ball.dx = -1;
        game.ball.dy = 1;
      }

      if (game.player1.score > 2 || game.player2.score > 2) {
        await this.handlEndGame(game, player1Socket, player2Socket, interval);
        return;
      }
      this.server.to(String(game.gameId)).emit('gameUpdates', game);
    }, 1000 / 60);
  }

  @SubscribeMessage('move')
  move(client: Socket, data: { userId: number; gameId: number; direction: string }) {
    // console.log('move', data);
    if (this.games[data.gameId].player1.userId === data.userId && data.direction === 'up') {
      this.games[data.gameId].player1.y -= 20;
      if (this.games[data.gameId].player1.y < 0) {
        this.games[data.gameId].player1.y = 0;
      }
    } else if (this.games[data.gameId].player1.userId === data.userId && data.direction === 'down') {
      this.games[data.gameId].player1.y += 20;
      if (this.games[data.gameId].player1.y > 720 - this.games[data.gameId].player1.height) {
        this.games[data.gameId].player1.y = 720 - this.games[data.gameId].player1.height;
      }
    } else if (this.games[data.gameId].player2.userId === data.userId && data.direction === 'up') {
      this.games[data.gameId].player2.y -= 20;
      if (this.games[data.gameId].player2.y < 0) {
        this.games[data.gameId].player2.y = 0;
      }
    }
    if (this.games[data.gameId].player2.userId === data.userId && data.direction === 'down') {
      this.games[data.gameId].player2.y += 20;
      if (this.games[data.gameId].player2.y > 720 - this.games[data.gameId].player2.height) {
        this.games[data.gameId].player2.y =  720 - this.games[data.gameId].player2.height;
      }
    }
  }

  //=================================================================================INVITES=================================================================================
  @SubscribeMessage('createInvite')
  async invite(client, data: { userId: number }) {
    console.log('createInvite', data);
    const token = this.jwtService.sign({ id: client.user.id, username: client.user.username }, { secret: 'secret', expiresIn: '1m' });
    if (!this.invites[client.user.id]) this.invites[client.user.id] = [];
    this.invites[client.user.id].push(token);
    if (data.userId)
      this.server.to(this.connectedUsers[data.userId].id).emit('invite', { token, from: client.user.id, avatar: client.user.avatar, username: client.user.username });
  }

  @SubscribeMessage('acceptInvite')
  async acceptInvite(client, data: { token: string; from: number; inviteOwner: number }) {
    console.log('acceptInvite', data);
    try {
      if (data.from == data.inviteOwner) return;
      console.log(this.invites);
      if (!this.invites[data.inviteOwner]) {
        client.emit('invalidInvite', { message: 'Invalid token' });
        return;
      }
      console.log('verifing token');
      const isValidToken = this.jwtService.verify(data.token, { secret: 'secret' });
      console.log('token verified');
      delete this.invites[data.inviteOwner];
      this.server.to(this.connectedUsers[data.inviteOwner].id).emit('inviteAccepted', { id: client.user.id, username: client.user.username });
      console.log('Create Game NOW');

      const user1 = await this.userService.findUnique({ id: data.inviteOwner });
      const user2 = await this.userService.findUnique({ id: client.user.id });

      if (user1.status !== Status.ONLINE || user2.status !== Status.ONLINE) {
        client.emit('invalidInvite', { message: 'User is not online' });
        return;
      }

      const player1Socket = this.connectedUsers[data.inviteOwner];
      const player2Socket = this.connectedUsers[client.user.id];

      const game = await this.createGame(player1Socket, player2Socket);
      console.log('newwww game', game);

      this.startGame(game, player1Socket, player2Socket);
    } catch (error) {
      console.log('invalid token');
      this.invites[data.inviteOwner] = this.invites[data.inviteOwner].filter((token) => token !== data.token);
      if (error.name === 'TokenExpiredError') {
        client.emit('invalidInvite', { message: 'Token expired' });
        return;
      }
      client.emit('invalidInvite', { message: 'Invalid token' });
    }
  }
}
//
//
//
//
