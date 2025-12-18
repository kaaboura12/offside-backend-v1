import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';

@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  },
})
export class AiGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly aiService: AiService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    // Gateway initialized
    const backendUrl = this.configService.get<string>('BACKEND_URL') || 'http://localhost:3000';
    console.log(`WebSocket gateway initialized. Backend URL: ${backendUrl}`);
  }

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

