import { Inject, Injectable } from "@nestjs/common";
import { Chat, CHAT_REPOSITORY_TOKEN, Id, type IChatRepository } from "../../domain/index.js";
import type { CreateChatRequest, CreateChatResponse } from "../payloads/index.js";

@Injectable()
export class CreateChatUseCase {
    public constructor(@Inject(CHAT_REPOSITORY_TOKEN) private readonly repository: IChatRepository) { }

    public async execute(payload: CreateChatRequest): Promise<CreateChatResponse> {
        const chat = Chat.create(payload.name, payload.description, Id.of(payload.actorId));
        await this.repository.save(chat);
        return { id: chat.id.value };
    }
}