import { Injectable } from "@nestjs/common";
import { CommandBus, EventBus, type ICommand, type IEvent, type IQuery, QueryBus } from "@nestjs/cqrs";

@Injectable()
export class CqrsBus {
    public constructor(
        private readonly queries: QueryBus,
        private readonly commands: CommandBus,
        private readonly events: EventBus
    ) { }

    public async fetch<Result, Input extends IQuery>(query: Input): Promise<Result> {
        return await this.queries.execute<Input, Result>(query);
    }

    public async execute<Result, Input extends ICommand>(command: Input): Promise<Result> {
        return await this.commands.execute(command);
    }

    public emit<Input extends IEvent>(event: Input): void {
        this.events.publisher.publish(event);
    }
}