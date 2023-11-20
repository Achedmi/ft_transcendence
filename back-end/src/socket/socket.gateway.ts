// import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import {
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  socket: Socket;

  //on init
  afterInit(server: Server) {
    // Handle initialization event
    console.log('Socket initialized');
    // this.createRoom(, 'aRoom');
  }

  handleConnection(client: Socket) {
    console.log('New client connected');
    // Handle connection event
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected');
    // Handle disconnection event
  }

  @SubscribeMessage('createRoom')
  createRoom(socket: Socket, data: string) {
    console.log('createRoom');
    socket.join('aRoom');
    socket.to('aRoom').emit('roomCreated', { room: 'aRoom' });
    // return { event: 'roomCreated', room: 'aRoom' };
  }

  @SubscribeMessage('toRoom')
  toRoom(socket: Socket, data: string) {
    console.log('toRoom');
    socket.to('aRoom').emit('toClient', { message: 'this message is toRoom' });
  }
}
