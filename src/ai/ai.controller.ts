import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatResponseDto } from './dto/chat-response.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async getChaosResponse(
    @Body() chatRequest: ChatRequestDto,
  ): Promise<ChatResponseDto> {
    return await this.aiService.getChaosResponse(chatRequest.message);
  }
}
