import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service.js';
import { ChatsGrpc } from './chats.grpc.js';

@Module({
  providers: [ChatsService],
  controllers: [ChatsGrpc]
})
export class ChatsModule { }
