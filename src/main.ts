import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { type AllConfigs, getConfigOptions } from './infrastructure/index.js';
import { createChatsService, createServer } from '@sorokchat-messenger/microservices';
import { AppModule } from './modules/index.js';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(ConfigModule.forRoot(getConfigOptions()));
  const configuration = context.get<ConfigService<AllConfigs>>(ConfigService);
  const host = configuration.getOrThrow("grpc.host", { infer: true });
  const port = configuration.getOrThrow("grpc.port", { infer: true });
  const url: string = `${host}:${port}`;
  await context.close();
  const application = await createServer(AppModule, createChatsService(url));
  const logger = new Logger("gRPC ChatsService");
  logger.log("Server starting...");
  await application.listen();
  logger.log(`Server run on ${url}`);
}
await bootstrap();
