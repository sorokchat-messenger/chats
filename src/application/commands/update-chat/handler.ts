import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";
import { UpdateChatCommand } from "./command.js";
import { CHAT_REPOSITORY_TOKEN, ChatNotFoundException, Id, type IChatRepository } from "../../../domain/index.js";
import { Inject } from "@nestjs/common";

export type UpdateChatResult = void;

@CommandHandler(UpdateChatCommand)
export class UpdateChatHandler implements ICommandHandler<UpdateChatCommand, UpdateChatResult> {
    public constructor(@Inject(CHAT_REPOSITORY_TOKEN) private readonly repository: IChatRepository) { }

    public async execute(command: UpdateChatCommand): Promise<void> {
        const chat = await this.repository.findById(Id.of(command.id));
        if (chat === null) throw new ChatNotFoundException();
        const actorId = Id.of(command.actorId);
        if (command.name !== null) chat.changeName(actorId, command.name);
        if (command.description !== null) chat.changeDescription(actorId, command.description);
        return await this.repository.save(chat);
    }
}