import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AiGateway } from './ai.gateway';

@Module({
  controllers: [AiController],
  providers: [AiService, AiGateway],
})
export class AiModule {}
