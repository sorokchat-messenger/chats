import { type Provider } from "@nestjs/common";
import { GetChatsByNameHandler } from "./get-chats-by-name/index.js";
import { GetChatsByUserHandler } from "./get-chats-by-user/index.js";

export { GetChatsByNameQuery, type GetChatsByNameResult } from './get-chats-by-name/index.js';
export { GetChatsByUserQuery, type GetChatsByUserResult } from './get-chats-by-user/index.js';

export const QUERY_HANDLERS: Provider[] = [
    GetChatsByNameHandler,
    GetChatsByUserHandler
];