/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { HTTP_PORT } from '@/env';

export interface SocketService {
  sendMessage(inRoom: boolean, room: string, topic: string, payload: any): Promise<void>;
}

@WebSocketGateway()
export class SocketServiceImpl implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SocketService {
  @WebSocketServer() server: Server;

  @SubscribeMessage('subscribe:DEVICE_ID')
  handleMessageSubscribe(client: Socket, payload: string): void {
    Logger.log(`${client.id} create room ${payload}`);
    // client.leave(payload)
    client.join(payload);
  }

  @SubscribeMessage('disSubscribe:DEVICE_ID')
  handleMessageDisSubscribe(client: Socket, payload: string): void {
    Logger.log(`${client.id} leave room ${payload}`);
    client.leave(payload);
  }

  afterInit(): void {
    Logger.log(`Socket server is initial at port ${HTTP_PORT}`);
  }

  handleConnection(client: Socket, ...args: any[]): void {
    Logger.log(`Socket Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    Logger.log(`Client disconnected: ${client.id}`);
  }

  public async sendMessage(inRoom: boolean, room: string, topic: string, payload: any): Promise<void> {
    try {
      if (inRoom) {
        this.server.in(room).emit(topic, {
          type: topic,
          data: payload,
        });
      } else {
        this.server.emit(topic, {
          type: topic,
          data: payload,
        });
      }
      Logger.log(`emit ${topic}`);
    } catch (error) {
      Logger.log(error);
    }
  }
}
