import { Injectable } from "@nestjs/common";
import { Participant as Model, ParticipantId, Role } from "../../../domain/index.js";
import { Participant as Persistence, ChatRole } from "@prisma/client";
import { Mapper } from "./mapper.js";
import { IdMapper } from "./id.mapper.js";

@Injectable()
export class ParticipantMapper implements Mapper<Model, Persistence> {
    public constructor(private readonly idMapper: IdMapper) { }

    public toPersistence(model: Model): Persistence {
        return {
            chatId: this.idMapper.toPersistence(model.id.chatId),
            userId: this.idMapper.toPersistence(model.id.userId),
            role: model.role.value as ChatRole
        }
    }

    public toModel(persistence: Persistence): Model {
        return Model.restore(
            this.idMapper.toModel(persistence.userId),
            this.idMapper.toModel(persistence.chatId),
            Role.of(persistence.role)
        );
    }
}