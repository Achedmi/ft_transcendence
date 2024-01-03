import { JwtService } from '@nestjs/jwt';
import { SubscribeMessage, WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { Status } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService, private readonly prisma: PrismaService) {}
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('chat Socket initialized');
  }

  private connectedUsers = {};

  async handleConnection(client: Socket) {
    try {
      // const testToken = this.jwtService.sign({ id: client.id }, { secret: 'secret', expiresIn: '1m' });
      // console.log(testToken);
      // const ff = this.jwtService.verify(
      //   'eyJhbGciOiJIUzI1NiIsInR5cCIsdsdf6IkpXVCJ9.eyJpZCI6ImJKcmJ3U3k1eWlQNWVZaTBBQUFCIiwiaWF0IjoxNzAzNDMxNzM3LCJleHAiOjE3MDM0MzE3OTd9.JK3lx4uhImMPrIjrW9fAERgwBDhtuqxK59NteeBRMh8',
      //   { secret: 'secret' },
      // );

      const token = client.handshake.headers.cookie?.split('userAT=')[1]?.split('; ')[0];
      const isValidToken = this.jwtService.verify(token, { publicKey: process.env.JWT_ACCESS_SECRET });
      if (!isValidToken || this.connectedUsers[isValidToken.id]) {
        console.log('----------', isValidToken?.usernae);
        client.disconnect();
        return;
      }
      const user = await this.userService.findUnique({ id: isValidToken.id });
      console.log('========================================online', user.username);
      client['user'] = user;
      this.connectedUsers[user.id] = client;
      const chats = await this.prisma.chat.findMany({
        where: {
          members: {
            some: {
              id: user.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      chats.forEach((chat) => {
        console.log('user: ' + user.username + ' joining room: ', chat.id);
        client.join(String(chat.id));
      });

      this.server.to('11').emit('message', { message: 'hello' });
      console.log('Client connected to Game socket: ', user.username);
    } catch (err) {
      console.log(err);
      client.disconnect();
    }
  }

  handleDisconnect(client) {
    if (!client.user) return;
    console.log('Client disconnected from Game socket: ', client.user.username);
    delete this.connectedUsers[client.user.id];
  }

  @SubscribeMessage('joinChat')
  joinChat(client: Socket, data) {
    console.log(client.id, 'joining room: ', data.chatId);
    client.join(data.chatId);
  }

  @SubscribeMessage('leaveChat')
  leaveChat(client: Socket, data) {
    console.log(client.id, ' leaving room: ', data.chatId);
    client.leave(data.chatId);
  }

  toChat(data) {
    console.log('toChat', data);
    this.server.to(String(data.chatId)).emit('message', data);
  }
}

//!!! if a user logged out, disconnect him from the socket
