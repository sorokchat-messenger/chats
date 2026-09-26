import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getConfigOptions } from '../infrastructure/index.js';

@Module({
  imports: [ConfigModule.forRoot(getConfigOptions())],
})
export class AppModule { }
