import { QueryHandler, type IQueryHandler } from "@nestjs/cqrs";
import { GetChatsByUserQuery } from "./query.js";
import { CHAT_REPOSITORY_TOKEN, ChatDetails, Id, type IChatRepository } from "../../../domain/index.js";
import { Inject } from "@nestjs/common";

export type GetChatsByUserResult = ChatDetails[];

@QueryHandler(GetChatsByUserQuery)
export class GetChatsByUserHandler implements IQueryHandler<GetChatsByUserQuery, GetChatsByUserResult> {
    public constructor(@Inject(CHAT_REPOSITORY_TOKEN) private readonly repository: IChatRepository) { }

    public async execute(query: GetChatsByUserQuery): Promise<GetChatsByUserResult> {
        return await this.repository.findByUser(Id.of(query.userId), query.limit, query.offset);
    }
}