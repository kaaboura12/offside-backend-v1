import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AiService } from './ai.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AiGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly aiService: AiService) {}

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { message: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const response = await this.aiService.getChaosResponse(data.message);
      
      // Send response back to the client
      client.emit('ai-response', {
        response: response.response,
      });
    } catch (error) {
      client.emit('error', {
        message: 'Failed to process message',
      });
    }
  }
}

