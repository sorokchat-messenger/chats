import { Inject, Injectable } from "@nestjs/common";
import { CHAT_REPOSITORY_TOKEN, ChatNotFoundException, Id, type IChatRepository } from "../../domain/index.js";
import type { UpdateChatRequest, UpdateChatResponse } from "../payloads/index.js";

@Injectable()
export class UpdateChatUseCase {
    public constructor(@Inject(CHAT_REPOSITORY_TOKEN) private readonly repository: IChatRepository) { }

    public async execute(payload: UpdateChatRequest): Promise<UpdateChatResponse> {
        const actorId = Id.of(payload.actorId)
        const chat = await this.repository.findById(Id.of(payload.id));
        if (chat === null) throw new ChatNotFoundException();
        if (payload.name !== undefined) chat.changeName(actorId, payload.name);
        if (payload.description !== undefined) chat.changeDescription(actorId, payload.description);
        return await this.repository.save(chat);
    }
}