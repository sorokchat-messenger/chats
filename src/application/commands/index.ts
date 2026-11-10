import { type Provider } from '@nestjs/common';
import { CreateChatHandler } from './create-chat/index.js';
import { UpdateChatHandler } from './update-chat/index.js';
import { DeleteChatHandler } from './delete-chat/index.js';
import { AddMemberHandler } from './add-member/index.js';
import { RemoveMemberHandler } from './remove-member/index.js';
import { ChangeMemberRoleHandler } from './change-member-role/index.js';

export { CreateChatCommand, type CreateChatResult } from './create-chat/index.js';
export { UpdateChatCommand, type UpdateChatResult } from './update-chat/index.js';
export { DeleteChatCommand, type DeleteChatResult } from './delete-chat/index.js';
export { AddMemberCommand, type AddMemberResult } from './add-member/index.js';
export { RemoveMemberCommand, type RemoveMemberResult } from './remove-member/index.js';
export { ChangeMemberRoleCommand, type ChangeMemberRoleResult } from './change-member-role/index.js';

export const COMMAND_HANDLERS: Provider[] = [
    CreateChatHandler,
    UpdateChatHandler,
    DeleteChatHandler,
    AddMemberHandler,
    RemoveMemberHandler,
    ChangeMemberRoleHandler
];