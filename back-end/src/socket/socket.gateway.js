"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SocketGateway = void 0;
// import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
var websockets_1 = require("@nestjs/websockets");
var SocketGateway = /** @class */ (function () {
    function SocketGateway() {
    }
    //on init
    SocketGateway.prototype.afterInit = function (server) {
        // Handle initialization event
        console.log('Socket initialized');
        // this.createRoom(, 'aRoom');
    };
    SocketGateway.prototype.handleConnection = function (client) {
        console.log('New client connected');
        // Handle connection event
    };
    SocketGateway.prototype.handleDisconnect = function (client) {
        console.log('Client disconnected');
        // Handle disconnection event
    };
    SocketGateway.prototype.createRoom = function (socket, data) {
        console.log('createRoom');
        socket.join('aRoom');
        socket.to('aRoom').emit('roomCreated', { room: 'aRoom' });
        // return { event: 'roomCreated', room: 'aRoom' };
    };
    SocketGateway.prototype.toRoom = function (socket, data) {
        console.log('toRoom');
        socket.to('aRoom').emit('toClient', { message: 'this message is toRoom' });
    };
    __decorate([
        (0, websockets_1.WebSocketServer)()
    ], SocketGateway.prototype, "server");
    __decorate([
        (0, websockets_1.SubscribeMessage)('createRoom')
    ], SocketGateway.prototype, "createRoom");
    __decorate([
        (0, websockets_1.SubscribeMessage)('toRoom')
    ], SocketGateway.prototype, "toRoom");
    SocketGateway = __decorate([
        (0, websockets_1.WebSocketGateway)()
    ], SocketGateway);
    return SocketGateway;
}());
exports.SocketGateway = SocketGateway;
