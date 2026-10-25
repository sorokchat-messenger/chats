import { Inject, Injectable } from "@nestjs/common";
import { type Chat, CHAT_REPOSITORY_TOKEN, type Id, type IChatRepository } from "../../domain/index.js";

export interface GetChatsByUserRequest {
    limit: number;
    offset: number;
    userId: Id;
};

export type GetChatsByUserResponse = {
    chats: Chat[];
};

@Injectable()
export class GetChatsByUserUseCase {
    public constructor(@Inject(CHAT_REPOSITORY_TOKEN) private readonly repository: IChatRepository) { }

    public async execute(payload: GetChatsByUserRequest): Promise<GetChatsByUserResponse> {
        const chats = await this.repository.findByUser(payload.userId, payload.limit, payload.offset);
        return { chats };
    }
}