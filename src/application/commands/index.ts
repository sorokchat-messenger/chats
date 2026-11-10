import { type Provider } from '@nestjs/common';
import { CreateChatHandler } from './create-chat/index.js';
import { UpdateChatHandler } from './update-chat/index.js';

export { CreateChatCommand, type CreateChatResult } from './create-chat/index.js';
export { UpdateChatCommand, type UpdateChatResult } from './update-chat/index.js';

export const COMMAND_HANDLERS: Provider[] = [CreateChatHandler, UpdateChatHandler];