import { Injectable } from "@nestjs/common";
import { Participant as Model } from "../../../domain/index.js";
import { Participant as Persistence } from "../../../generated/prisma/client.js";
import { Mapper } from "./mapper.js";
import { IdMapper } from "./id.mapper.js";

@Injectable()
export class ParticipantMapper implements Mapper<Model, Persistence> {
    public constructor(private readonly idMapper: IdMapper) { }

    public toPersistence(model: Model): Persistence {
        return {
            id: this.idMapper.toPersistence(model.id),
            chatId: this.idMapper.toPersistence(model.chatId),
            userId: this.idMapper.toPersistence(model.userId),
            role: model.role
        }
    }

    public toModel(persistence: Persistence): Model {
        return Model.restore(
            this.idMapper.toModel(persistence.id),
            this.idMapper.toModel(persistence.userId),
            this.idMapper.toModel(persistence.chatId),
            persistence.role
        );
    }
}