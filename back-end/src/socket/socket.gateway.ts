// import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { SubscribeMessage, WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('Socket initialized');
  }

  handleConnection(client: Socket) {
    console.log('New client connected: ', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ', client.id);
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
    this.server.to(data.chatId).emit('message', data);
  }
}
