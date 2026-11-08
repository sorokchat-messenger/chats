import { Id } from "./id.value-object.js";
import { ValueObject } from "./value-object.js";

export class ParticipantId extends ValueObject<ParticipantId> {
    private readonly _userId: Id;
    private readonly _chatId: Id;

    private constructor(userId: Id, chatId: Id) {
        super();
        this._chatId = chatId;
        this._userId = userId;
    }

    public get userId(): Id {
        return this._userId.clone();
    }

    public get chatId(): Id {
        return this._chatId.clone();
    }

    public clone(): ParticipantId {
        return new ParticipantId(this.userId, this.chatId);
    }

    public static of(userId: Id, chatId: Id): ParticipantId {
        return new ParticipantId(userId.clone(), chatId.clone());
    }
}