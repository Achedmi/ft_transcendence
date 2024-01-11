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
    
  }

  private connectedUsers = {};

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.cookie?.split('userAT=')[1]?.split('; ')[0];
      const isValidToken = this.jwtService.verify(token, { publicKey: process.env.JWT_ACCESS_SECRET });
      if (!isValidToken || this.connectedUsers[isValidToken.id]) {
        client.disconnect();
        return;
      }
      const user = await this.userService.findUnique({ id: isValidToken.id });
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
        client.join(String(chat.id));
      });

    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client) {
    if (!client.user) return;
    delete this.connectedUsers[client.user.id];
  }

  emitJoinChat(data) {
    this.server.to(String(data.chatId)).emit('joinChat', data);
  }

  @SubscribeMessage('joinChat')
  joinChat(client: Socket, data) {
    client.join(data.chatId);
  }

  @SubscribeMessage('leaveChat')
  leaveChat(client: Socket, data) {
    client.leave(data.chatId);
  }

  toChat(data, to?) {
    if (to && !this.connectedUsers[data.userId].rooms.has(String(data.chatId))) {
      this.connectedUsers[data.userId].join(String(data.chatId));
      this.connectedUsers[String(to)]?.join(String(data.chatId));
    }
    this.server.to(String(data.chatId)).emit('message', data);
  }

  chatUpdated(chatId, infos) {
    this.server.to(String(chatId)).emit('chatUpdated', { chatId, infos });
  }
}
