import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, getConfigOptions } from '../infrastructure/index.js';
import { ChatsModule } from './chats/index.js';

@Module({
  imports: [ConfigModule.forRoot(getConfigOptions()), DatabaseModule, ChatsModule],
})
export class AppModule { }
