import { GrpcMethod, GrpcService, Payload } from '@nestjs/microservices';
import {
    CHATS_SERVICE,
    type UpdateChatRequest,
    type CreateChatRequest,
    type CreateChatResponse,
    type DeleteChatRequest,
    type AddMemberToChatRequest,
    type RemoveMemberFromChatRequest,
    type GrantMemberRequest,
    type RevokeMemberRequest,
    type GetChatsByNameRequest,
    type GetChatsByNameResponse,
    type GetChatsByUserResponse,
    type GetChatsByUserRequest,
} from '@sorokchat-messenger/microservices';
import { Role } from '../../domain/index.js';
import { CqrsBus } from '../../infrastructure/index.js';
import {
    AddMemberCommand,
    type AddMemberResult,
    ChangeMemberRoleCommand,
    type ChangeMemberRoleResult,
    CreateChatCommand, type CreateChatResult,
    DeleteChatCommand,
    type DeleteChatResult,
    GetChatsByNameQuery, type GetChatsByNameResult,
    GetChatsByUserQuery,
    RemoveMemberCommand,
    type RemoveMemberResult,
    UpdateChatCommand,
    type UpdateChatResult
} from '../../application/index.js';

const DEFAULT_LIMIT: number = -1;
const DEFAULT_OFFSET: number = 0;

@GrpcService(CHATS_SERVICE.NAME)
export class ChatsGrpc {
    public constructor(
        private readonly bus: CqrsBus
    ) { }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.GET_CHATS_BY_NAME)
    public async getByName(@Payload() payload: GetChatsByNameRequest): Promise<GetChatsByNameResponse> {
        const chats = await this.bus.fetch<GetChatsByNameResult, GetChatsByNameQuery>(
            new GetChatsByNameQuery(payload.name, payload.limit || DEFAULT_LIMIT, payload.offset || DEFAULT_OFFSET, payload.actorId)
        );
        return { chats };
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.GET_CHATS_BY_USER)
    public async getByUser(@Payload() payload: GetChatsByUserRequest): Promise<GetChatsByUserResponse> {
        const chats = await this.bus.fetch<GetChatsByNameResult, GetChatsByUserQuery>(
            new GetChatsByUserQuery(payload.userId, payload.limit || DEFAULT_LIMIT, payload.offset || DEFAULT_OFFSET)
        );
        return { chats }
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.CREATE_CHAT)
    public async create(@Payload() payload: CreateChatRequest): Promise<CreateChatResponse> {
        return await this.bus.execute<CreateChatResult, CreateChatCommand>(
            new CreateChatCommand(payload.name, payload.description, payload.actorId)
        );
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.UPDATE_CHAT)
    public async update(@Payload() payload: UpdateChatRequest): Promise<void> {
        return await this.bus.execute<UpdateChatResult, UpdateChatCommand>(
            new UpdateChatCommand(payload.id, payload.name || null, payload.description || null, payload.actorId)
        );
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.DELETE_CHAT)
    public async delete(@Payload() payload: DeleteChatRequest): Promise<void> {
        return await this.bus.execute<DeleteChatResult, DeleteChatCommand>(
            new DeleteChatCommand(payload.actorId, payload.id)
        );
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.ADD_MEMBER_TO_CHAT)
    public async addMember(@Payload() payload: AddMemberToChatRequest): Promise<void> {
        return await this.bus.execute<AddMemberResult, AddMemberCommand>(
            new AddMemberCommand(payload.chatId, payload.actorId, payload.userId)
        );
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.REMOVE_MEMBER_FROM_CHAT)
    public async removeMember(@Payload() payload: RemoveMemberFromChatRequest): Promise<void> {
        return await this.bus.execute<RemoveMemberResult, RemoveMemberCommand>(
            new RemoveMemberCommand(payload.chatId, payload.actorId, payload.userId)
        );
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.GRANT_MEMBER)
    public async grantMember(@Payload() payload: GrantMemberRequest): Promise<void> {
        return await this.bus.execute<ChangeMemberRoleResult, ChangeMemberRoleCommand>(
            new ChangeMemberRoleCommand(payload.chatId, payload.actorId, payload.userId, payload.role)
        );
    }

    @GrpcMethod(CHATS_SERVICE.NAME, CHATS_SERVICE.REVOKE_MEMBER)
    public async revokeMember(@Payload() payload: RevokeMemberRequest): Promise<void> {
        return await this.bus.execute<ChangeMemberRoleResult, ChangeMemberRoleCommand>(
            new ChangeMemberRoleCommand(payload.chatId, payload.actorId, payload.userId, Role.MEMBER.value)
        );
    }
}