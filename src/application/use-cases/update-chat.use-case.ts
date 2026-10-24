import { Inject, Injectable } from "@nestjs/common";
import { CHAT_REPOSITORY_TOKEN, ChatNotFoundException, Id, type IChatRepository } from "../../domain/index.js";
import type { UpdateChatRequest, UpdateChatResponse } from "../payloads/index.js";

@Injectable()
export class UpdateChatUseCase {
    public constructor(@Inject(CHAT_REPOSITORY_TOKEN) private readonly repository: IChatRepository) { }

    public async execute(payload: UpdateChatRequest): Promise<UpdateChatResponse> {
        const chat = await this.repository.findById(Id.of(payload.id));
        if (chat === null) throw new ChatNotFoundException();
        if (payload.name) chat.changeName(payload.name);
        if (payload.description) chat.changeDescription(payload.description);
        await this.repository.save(chat);
    }
}