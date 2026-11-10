import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CHAT_REPOSITORY_TOKEN, ChatDetails, Id, type IChatRepository } from "../../../domain/index.js";
import { GetChatsByNameQuery } from "./query.js";
import { Inject } from "@nestjs/common";

export type GetChatsByNameResult = ChatDetails[];

@QueryHandler(GetChatsByNameQuery)
export class GetChatsByNameHandler implements IQueryHandler<GetChatsByNameQuery, GetChatsByNameResult> {
    public constructor(@Inject(CHAT_REPOSITORY_TOKEN) private readonly repository: IChatRepository) { }

    public async execute(query: GetChatsByNameQuery): Promise<GetChatsByNameResult> {
        return await this.repository.findByName(query.name, Id.of(query.actorId), query.limit, query.offset);
    }
}