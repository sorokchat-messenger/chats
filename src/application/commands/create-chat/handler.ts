import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";
import { CreateChatCommand } from "./command.js";
import { Inject } from "@nestjs/common";
import { Chat, CHAT_REPOSITORY_TOKEN, Id, type IChatRepository } from "../../../domain/index.js";

export type CreateChatResult = { id: string };

@CommandHandler(CreateChatCommand)
export class CreateChatHandler implements ICommandHandler<CreateChatCommand, CreateChatResult> {
    public constructor(@Inject(CHAT_REPOSITORY_TOKEN) private readonly repository: IChatRepository) { }

    public async execute(command: CreateChatCommand): Promise<CreateChatResult> {
        const chat = Chat.create(command.name, command.description, Id.of(command.actorId));
        await this.repository.save(chat);
        return { id: chat.id.value };
    }
}