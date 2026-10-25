import { Inject, Injectable } from "@nestjs/common";
import { type Chat, CHAT_REPOSITORY_TOKEN, type Id, type IChatRepository } from "../../domain/index.js";

export interface GetChatsByNameRequest {
    name: string;
    limit: number;
    offset: number;
    actorId: Id;
};

export interface GetChatsByNameResponse {
    chats: Chat[];
};

@Injectable()
export class GetChatsByNameUseCase {
    public constructor(@Inject(CHAT_REPOSITORY_TOKEN) private readonly repository: IChatRepository) { }

    public async execute(payload: GetChatsByNameRequest): Promise<GetChatsByNameResponse> {
        const chats = await this.repository.findByName(payload.name, payload.actorId, payload.limit, payload.offset);
        return { chats };
    }
}