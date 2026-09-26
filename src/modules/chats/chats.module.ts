import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service.js';

@Module({
  providers: [ChatsService]
})
export class ChatsModule { }
