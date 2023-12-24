import { SubscribeMessage, WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { GameStatus, Status } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { GameService } from 'src/game/game.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway({ namespace: '/game', cors: true, origins: 'http://localhost:6969' })
export class GameGateway {
  constructor(private readonly gameService: GameService, private readonly userService: UserService, private readonly jwtService: JwtService) {}

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
      status: GameStatus;
    };
  } = {};

  private connectedUsers = new Set();

  //==================================================handleConnection==================================================

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.cookie?.split('userAT=')[1]?.split('; ')[0];
      const isValidToken = this.jwtService.verify(token, { publicKey: process.env.JWT_ACCESS_SECRET });
      if (!isValidToken || this.connectedUsers.has(isValidToken.id)) {
        client.disconnect();
        return;
      }
      const user = await this.userService.findUnique({ id: isValidToken.id });
      await this.updateUserStatus(user.id, Status.ONLINE, client.id);
      client['user'] = user;
      this.connectedUsers.add(client['user'].id);
      console.log('Client connected to Game socket: ', client['user'].username);
    } catch (err) {
      client.disconnect();
    }
  }

  //==================================================handleDisconnect==================================================

  async handleDisconnect(client) {
    if (!client.user) return;
    console.log('Client disconnected from Game socket: ', client.user.username);
    await this.updateUserStatus(client.user.id, Status.OFFLINE, client.id);
    this.connectedUsers.delete(client.user.id);
    delete this.readyToPlayQueue[client.user.id];
  }

  //==================================================handleDisconnect==================================================

  async updateUserStatus(userId: number, status: Status, clientId: string) {
    await this.userService.updateUserStatus(userId, status);
    this.server.to(clientId).emit('updateStatus', status);
  }

  @SubscribeMessage('readyToPlay')
  async readyToPlay(client, data: { userId: number }) {
    this.readyToPlayQueue[data.userId] = client;

    await this.updateUserStatus(data.userId, Status.INQUEUE, client.id);

    if (Object.keys(this.readyToPlayQueue).length >= 2) {
      const player1Socket = this.readyToPlayQueue[Object.keys(this.readyToPlayQueue)[0]];
      const player2Socket = this.readyToPlayQueue[Object.keys(this.readyToPlayQueue)[1]];
      this.readyToPlayQueue = {};

      let count = 2;
      const uniqueRoom = String(uuidv4());

      player1Socket.join(uniqueRoom);
      player2Socket.join(uniqueRoom);

      await this.updateUserStatus(player1Socket['user'].id, Status.STARTINGGAME, player1Socket.id);
      await this.updateUserStatus(player2Socket['user'].id, Status.STARTINGGAME, player2Socket.id);

      const interval = setInterval(async () => {
        if (count === 0) {
          clearInterval(interval);

          const game = await this.gameService.create({
            players: [player1Socket['user'].id, player2Socket['user'].id],
          });

          player1Socket['gameId'] = game.id;
          player2Socket['gameId'] = game.id;

          this.games[game.id] = {
            player1: {
              userId: player1Socket['user'].id,
              socketId: player1Socket.id,
              score: 0,
            },
            player2: {
              userId: player2Socket['user'].id,
              socketId: player2Socket.id,
              score: 0,
            },
            gameId: game.id,
            status: GameStatus.ONGOING,
          };

          player1Socket.leave(uniqueRoom);
          player2Socket.leave(uniqueRoom);

          player1Socket.join(String(game.id));
          player2Socket.join(String(game.id));

          if (player1Socket.disconnected || player2Socket.disconnected) {
            await this.gameService.update(client.gameId, {
              player1Score: player1Socket.disconnected ? 0 : 3,
              player2Score: player2Socket.disconnected ? 0 : 3,
              winnerPlayer: player1Socket.disconnected ? player2Socket.user.id : player1Socket.user.id,
              status: GameStatus.ENDED,
            });
            this.server.to(String(game.id)).emit('gameEnded');
            return;
          }

          await Promise.all([
            await this.updateUserStatus(player1Socket['user'].id, Status.INGAME, player1Socket.id),
            await this.updateUserStatus(player2Socket['user'].id, Status.INGAME, player2Socket.id),
          ]);

          this.server.to(String(game.id)).emit('gameIsReady', this.games[game.id]);

          if (player1Socket.disconnected || player2Socket.disconnected) {
            await this.gameService.update(client.gameId, {
              player1Score: player1Socket.disconnected ? 0 : 3,
              player2Score: player2Socket.disconnected ? 0 : 3,
              winnerPlayer: player1Socket.disconnected ? player2Socket.user.id : player1Socket.user.id,
              status: GameStatus.ENDED,
            });
            this.server.to(String(game.id)).emit('gameEnded');
            return;
          }

          this.startGame(this.games[game.id], player1Socket, player2Socket);
        } else if (player1Socket.disconnected || player2Socket.disconnected) {
          player1Socket.disconnected ?? player2Socket.emit('gameEnded');
          player2Socket.disconnected ?? player1Socket.emit('gameEnded');
          clearInterval(interval);
          return;
        }

        this.server.to(uniqueRoom).emit('countdown', count);
        count--;
      }, 1000);
    }
  }

  async startGame(game, player1Socket, player2Socket) {
    const interval = setInterval(async () => {
      if (player1Socket.disconnected || player2Socket.disconnected) {
        clearInterval(interval);
        this.server.to(String(game.gameId)).emit('gameEnded');
        await this.gameService.update(game.gameId, {
          player1Score: player1Socket.disconnected ? 0 : 3,
          player2Score: player2Socket.disconnected ? 0 : 3,
          winnerPlayer: player1Socket.disconnected ? player2Socket.user.id : player1Socket.user.id,
          status: GameStatus.ENDED,
        });
        this.server.to(String(game.id)).emit('gameEnded');
        return;
      }
      if (game.player1.score > 2 || game.player2.score > 2) {
        clearInterval(interval);
        await this.gameService.update(game.gameId, {
          player1Score: game.player1.score,
          player2Score: game.player2.score,
          winnerPlayer: game.player1.score > game.player2.score ? game.player1.userId : game.player2.userId,
          status: GameStatus.ENDED,
        });
        this.server.to(String(game.gameId)).emit('gameEnded');
      }
      this.server.to(String(game.gameId)).emit('gameUpdates', game);
    }, 1000 / 60);
  }

  @SubscribeMessage('incrementScore')
  incrementScore(client: Socket, data: { userId: number; gameId: number }) {
    if (this.games[data.gameId].player1.userId === data.userId) this.games[data.gameId].player1.score++;
    else this.games[data.gameId].player2.score++;
  }
}
//
//
