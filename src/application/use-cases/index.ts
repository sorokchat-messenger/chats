import { AddMemberUseCase } from './add-member.use-case.js';
import { ChangeMemberRoleUseCase } from './change-member-role.use-case.js';
import { CreateChatUseCase } from './create-chat.use-case.js';
import { DeleteChatUseCase } from './delete-chat.use-case.js';
import { GetChatsByNameUseCase } from './get-chat-by-name.use-case.js';
import { GetChatsByUserUseCase } from './get-chat-by-user.use-case.js';
import { RemoveMemberUseCase } from './remove-member.use-case.js';
import { UpdateChatUseCase } from './update-chat.use-case.js';

export * from './create-chat.use-case.js';
export * from './update-chat.use-case.js';
export * from './delete-chat.use-case.js';
export * from './add-member.use-case.js';
export * from './remove-member.use-case.js';
export * from './change-member-role.use-case.js';
export * from './get-chat-by-name.use-case.js';
export * from './get-chat-by-user.use-case.js';

export const USE_CASES = [
    CreateChatUseCase,
    UpdateChatUseCase,
    DeleteChatUseCase,
    AddMemberUseCase,
    RemoveMemberUseCase,
    ChangeMemberRoleUseCase,
    GetChatsByNameUseCase,
    GetChatsByUserUseCase
];