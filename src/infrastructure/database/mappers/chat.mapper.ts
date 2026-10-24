import { Injectable } from "@nestjs/common";
import { Chat as Model } from "../../../domain/index.js";
import { Chat as ChatPersistence, Participant } from "../generated/prisma/client.js";
import { IdMapper } from "./id.mapper.js";
import { Mapper } from "./mapper.js";
import { ParticipantMapper } from "./participant.mapper.js";

export type Persistence = ChatPersistence & {
    participants: Participant[];
}


@Injectable()
export class ChatMapper implements Mapper<Model, Persistence> {
    public constructor(
        private readonly idMapper: IdMapper,
        private readonly participantMapper: ParticipantMapper
    ) { }

    public toPersistence(chat: Model): Persistence {
        return {
            id: this.idMapper.toPersistence(chat.id),
            name: chat.name,
            description: chat.description,
            participants: chat.participants.map(participant => this.participantMapper.toPersistence(participant))
        }
    }

    public toModel(chat: Persistence): Model {
        return Model.restore(
            this.idMapper.toModel(chat.id),
            chat.name,
            chat.description,
            chat.participants.map(participant => this.participantMapper.toModel(participant))
        );
    }
}