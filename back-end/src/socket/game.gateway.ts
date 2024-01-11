import { SubscribeMessage, WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { GameStatus, GameType, Status } from '@prisma/client';
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
  baseHeight: number;
  baseWidth: number;
};

type Ball = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
  accel: number;
  speed: number;
};
@WebSocketGateway({ namespace: '/game', cors: true, origins: '*' })
export class GameGateway {
  constructor(private readonly gameService: GameService, private readonly userService: UserService, private readonly jwtService: JwtService) {}

  @WebSocketServer()
  server: Server;

  private readyToPlayClassicQueue = {};
  private readyToPlayPowerQueue = {};

  private games: {
    [gameId: number]: {
      player1: Player;
      player2: Player;
      gameId: number;
      status: GameStatus;
      ball: Ball;
      type: 'power' | 'classic';
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
      // const ff = this.jwtService.verify(
      //   'eyJhbGciOiJIUzI1NiIsInR5cCIsdsdf6IkpXVCJ9.eyJpZCI6ImJKcmJ3U3k1eWlQNWVZaTBBQUFCIiwiaWF0IjoxNzAzNDMxNzM3LCJleHAiOjE3MDM0MzE3OTd9.JK3lx4uhImMPrIjrW9fAERgwBDhtuqxK59NteeBRMh8',
      //   { secret: 'secret' },
      // );

      const token = client.handshake.headers.cookie?.split('userAT=')[1]?.split('; ')[0];
      const isValidToken = this.jwtService.verify(token, { publicKey: process.env.JWT_ACCESS_SECRET });
      if (!isValidToken || this.connectedUsers[isValidToken.id]) {
        client.disconnect();
        return;
      }
      const user = await this.userService.findUniqueWithoutSensitiveData({ id: isValidToken.id });
      await this.updateUserStatus(user.id, Status.ONLINE, client.id);
      client['user'] = user;
      this.connectedUsers[user.id] = client;

    } catch (err) {
      client.disconnect();
    }
  }

  //==================================================handleDisconnect==================================================

  async handleDisconnect(client) {
    if (!client.user) return;
    delete this.connectedUsers[client.user.id];
    delete this.readyToPlayClassicQueue[client.user.id];
    delete this.readyToPlayPowerQueue[client.user.id];
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

  async createGame(player1Socket, player2Socket, type: 'power' | 'classic') {
    const game = await this.gameService.create({
      players: [player1Socket['user'].id, player2Socket['user'].id],
      type: type == 'classic' ? GameType.CLASSIC : GameType.POWERUP,
    });
    //
    player1Socket['gameId'] = game.id;
    player2Socket['gameId'] = game.id;

    this.games[game.id] = {
      player1: {
        userId: player1Socket['user'].id,
        socketId: player1Socket.id,
        score: 0,
        x: 0,
        y: 720 / 2 - 60,
        width: 20,
        height: 120,
        baseHeight: 120,
        baseWidth: 20,
      },
      player2: {
        userId: player2Socket['user'].id,
        socketId: player2Socket.id,
        score: 0,
        x: 1280 - 20,
        y: 720 / 2 - 60,
        width: 20,
        height: 120,
        baseHeight: 120,
        baseWidth: 20,
      },
      gameId: game.id,
      status: GameStatus.ONGOING,
      ball: {
        x: 1280 / 2 - 10,
        y: 720 / 2 - 10,
        dx: Math.random() < 0.5 ? 4 : -4,
        dy: Math.random() < 0.5 ? 4 : -4,
        maxX: 1280 - 10,
        maxY: 720 - 10,
        minX: 10,
        minY: 10,
        size: 10,
        accel: 0.2,
        speed: 4,
      },
      type,
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
  async readyToPlay(client, data: { userId: number; type: string }) {
    if (data.type === 'power') this.readyToPlayPowerQueue[data.userId] = client;
    else this.readyToPlayClassicQueue[data.userId] = client;

    await this.updateUserStatus(data.userId, Status.INQUEUE, client.id);

    if (Object.keys(this.readyToPlayClassicQueue).length >= 2 || Object.keys(this.readyToPlayPowerQueue).length >= 2) {
      let player1Socket;
      let player2Socket;
      let gameType;
      if (Object.keys(this.readyToPlayClassicQueue).length >= 2) {
        gameType = 'classic';
        player1Socket = this.readyToPlayClassicQueue[Object.keys(this.readyToPlayClassicQueue)[0]];
        player2Socket = this.readyToPlayClassicQueue[Object.keys(this.readyToPlayClassicQueue)[1]];
        this.readyToPlayClassicQueue = {};
      } else {
        gameType = 'power';
        player1Socket = this.readyToPlayPowerQueue[Object.keys(this.readyToPlayPowerQueue)[0]];
        player2Socket = this.readyToPlayPowerQueue[Object.keys(this.readyToPlayPowerQueue)[1]];
        this.readyToPlayPowerQueue = {};
      }

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

          const game = await this.createGame(player1Socket, player2Socket, gameType);
          if (!game) return;

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

  async startGame(game, player1Socket, player2Socket) {
    this.server.to(String(game.gameId)).emit('gameIsReady', { game, player1: player1Socket.user, player2: player2Socket.user, gameId: game.gameId });

    const interval = setInterval(async () => {
      if (player1Socket.disconnected || player2Socket.disconnected) {
        await this.handlGameEndOnDisconnect(game.gameId, player1Socket, player2Socket, interval);
        return;
      }
      game.ball.y += game.ball.dy;
      game.ball.x += game.ball.dx;
      const dt = 1 / 60;

      function accelerate(ball, dx, dy, dt, accel) {
        // calculate next position
        const x2 = ball.x + dx * dt + (accel * dt * dt) / 2;
        const y2 = ball.y + dy * dt + (accel * dt * dt) / 2;
        // calculate next velocity
        const nextDx = dx + accel * dt * (dx > 0 ? 1 : -1);
        const nextDy = dy + accel * dt * (dy > 0 ? 1 : -1);
        return { nextX: x2 - ball.x, nextY: y2 - ball.y, x: x2, y: y2, dx: nextDx, dy: nextDy };
      }

      function intersect(x1, y1, x2, y2, x3, y3, x4, y4, d?) {
        const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
        if (denom != 0) {
          const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
          if (ua >= 0 && ua <= 1) {
            const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
            if (ub >= 0 && ub <= 1) {
              const x = x1 + ua * (x2 - x1);
              const y = y1 + ua * (y2 - y1);
              return { x, y };
            }
          }
        }
        return null;
      }

      function ballIntercept() {
        const futureBallX = game.ball.x + game.ball.dx;
        const futureBallY = game.ball.y + game.ball.dy;

        let interception = intersect(
          game.ball.x,
          game.ball.y,
          futureBallX,
          futureBallY,
          game.player1.x + game.player1.width,
          game.player1.y,
          game.player1.x + game.player1.width,
          game.player1.y + game.player1.height,
        );
        if (interception) {
          game.ball.dx *= -1;
          return;
        }

        interception = intersect(game.ball.x, game.ball.y, futureBallX, futureBallY, game.player2.x, game.player2.y, game.player2.x, game.player2.y + game.player2.height);
        if (interception) {
          game.ball.dx *= -1;
          return;
        }

        // check top edges of paddle
        interception = intersect(game.ball.x, game.ball.y, futureBallX, futureBallY, game.player1.x + game.player1.width, game.player1.y, game.player1.x, game.player1.y);
        if (interception) {
          game.ball.dy *= -1;
          return;
        }

        interception = intersect(game.ball.x, game.ball.y, futureBallX, futureBallY, game.player2.x, game.player2.y, game.player2.x + game.player2.width, game.player2.y);
        if (interception) {
          game.ball.dy *= -1;
          return;
        }
        // check bottom edges of paddle

        interception = intersect(
          game.ball.x,
          game.ball.y,
          futureBallX,
          futureBallY,
          game.player1.x + game.player1.width,
          game.player1.y + game.player1.height,
          game.player1.x,
          game.player1.y + game.player1.height,
        );
        if (interception) {
          game.ball.dy *= -1;
          return;
        }

        interception = intersect(
          game.ball.x,
          game.ball.y,
          futureBallX,
          futureBallY,
          game.player2.x,
          game.player2.y + game.player2.height,
          game.player2.x + game.player2.width,
          game.player2.y + game.player2.height,
        );
        if (interception) {
          game.ball.dy *= -1;
          return;
        }
      }

      const pos = accelerate(game.ball, game.ball.dx, game.ball.dy, dt, game.ball.accel);

      game.ball.x = pos.x;
      game.ball.y = pos.y;
      game.ball.dx = pos.dx;
      game.ball.dy = pos.dy;

      if (game.ball.y > game.ball.maxY) {
        game.ball.y = game.ball.maxY;
        game.ball.dy = -game.ball.dy;
      }
      if (game.ball.y < game.ball.minY) {
        game.ball.y = game.ball.minY;
        game.ball.dy = -game.ball.dy;
      }

      ballIntercept();

      // check if ball hits left or right wall and reset it if it does
      if (game.ball.x < -20 || game.ball.x > 1280) {
        if (game.ball.x < -20) {
          if (game.type === 'power') {
            game.player1.height = game.player1.height + 50;
            game.player2.height = game.player2.baseHeight;
          }
          game.player2.score++;
          game.ball.dx = 1;
        } else if (game.ball.x > 1280) {
          if (game.type === 'power') {
            game.player2.height = game.player2.height + 50;
            game.player1.height = game.player1.baseHeight;
          }
          game.player1.score++;
          game.ball.dx = -1;
        }
        game.ball.dy = Math.random() < 0.5 ? game.ball.speed : -game.ball.speed;
        game.ball.dx = Math.random() < 0.5 ? game.ball.speed : -game.ball.speed;
        game.ball.x = 1280 / 2 - 10;
        game.ball.y = 720 / 2 - 10;
        game.player1.x = 0;
        game.player1.y = 720 / 2 - 60;
        game.player2.x = 1280 - 20;
        game.player2.y = 720 / 2 - 60;
      }

      if (game.type === 'classic' && (game.player1.score > 2 || game.player2.score > 2)) {
        await this.handlEndGame(game, player1Socket, player2Socket, interval);
        return;
      } else if (game.type === 'power' && (game.player1.score > 4 || game.player2.score > 4)) {
        await this.handlEndGame(game, player1Socket, player2Socket, interval);
        return;
      }
      this.server.to(String(game.gameId)).emit('gameUpdates', game);
    }, 1000 / 60);
  }

  @SubscribeMessage('move')
  move(client: Socket, data: { userId: number; gameId: number; direction: string }) {
    if (!this.games[data.gameId]) return;
    if (this.games[data.gameId].player1.userId === data.userId && data.direction === 'up') {
      this.games[data.gameId].player1.y -= 5;
      if (this.games[data.gameId].player1.y < 0) {
        this.games[data.gameId].player1.y = 0;
      }
    } else if (this.games[data.gameId].player1.userId === data.userId && data.direction === 'down') {
      this.games[data.gameId].player1.y += 5;
      if (this.games[data.gameId].player1.y > 720 - this.games[data.gameId].player1.height) {
        this.games[data.gameId].player1.y = 720 - this.games[data.gameId].player1.height;
      }
    } else if (this.games[data.gameId].player2.userId === data.userId && data.direction === 'up') {
      this.games[data.gameId].player2.y -= 5;
      if (this.games[data.gameId].player2.y < 0) {
        this.games[data.gameId].player2.y = 0;
      }
    }
    if (this.games[data.gameId].player2.userId === data.userId && data.direction === 'down') {
      this.games[data.gameId].player2.y += 5;
      if (this.games[data.gameId].player2.y > 720 - this.games[data.gameId].player2.height) {
        this.games[data.gameId].player2.y = 720 - this.games[data.gameId].player2.height;
      }
    }
  }

  //=================================================================================INVITES=================================================================================
  @SubscribeMessage('createInvite')
  async invite(client, data: { userId: number }) {
    const token = this.jwtService.sign({ id: client.user.id, username: client.user.username }, { secret: 'secret', expiresIn: '1m' });
    if (!this.invites[client.user.id]) this.invites[client.user.id] = [];
    this.invites[client.user.id].push(token);
    if (data.userId)
      this.server.to(this.connectedUsers[data.userId].id).emit('invite', { token, from: client.user.id, avatar: client.user.avatar, username: client.user.username });
  }

  @SubscribeMessage('acceptInvite')
  async acceptInvite(client, data: { token: string; from: number; inviteOwner: number }) {
    try {
      if (data.from == data.inviteOwner) return;
      if (!this.invites[data.inviteOwner]) {
        client.emit('invalidInvite', { message: 'Invalid token' });
        return;
      }
      const isValidToken = this.jwtService.verify(data.token, { secret: 'secret' });
      delete this.invites[data.inviteOwner];
      this.server.to(this.connectedUsers[data.inviteOwner].id).emit('inviteAccepted', { id: client.user.id, username: client.user.username });

      const user1 = await this.userService.findUnique({ id: data.inviteOwner });
      const user2 = await this.userService.findUnique({ id: client.user.id });

      if (user1.status !== Status.ONLINE || user2.status !== Status.ONLINE) {
        client.emit('invalidInvite', { message: 'User is not online' });
        return;
      }

      const player1Socket = this.connectedUsers[data.inviteOwner];
      const player2Socket = this.connectedUsers[client.user.id];

      const game = await this.createGame(player1Socket, player2Socket, 'classic');

      this.startGame(game, player1Socket, player2Socket);
    } catch (error) {
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
