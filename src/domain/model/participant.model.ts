import { CHAT_ROLE_HIERARCHY, ChatRole } from "@sorokchat-messenger/contracts";
import { Id } from "./id.model.js";

export class Participant {
    private readonly _id: Id;
    private readonly _userId: Id;
    private readonly _chatId: Id;
    private _role: ChatRole;

    public get id(): Id {
        return this._id.clone();
    }

    public get userId(): Id {
        return this._userId.clone();
    }

    public get chatId(): Id {
        return this._chatId.clone();
    }

    public get role(): ChatRole {
        return this._role;
    }

    public changeRole(role: ChatRole): Participant {
        this._role = role;
        return this;
    }

    private constructor(id: Id, userId: Id, chatId: Id, role: ChatRole) {
        this._id = id;
        this._userId = userId;
        this._chatId = chatId;
        this._role = role;
    }

    public get isAdmin(): boolean {
        return CHAT_ROLE_HIERARCHY.hasRole(ChatRole.ADMIN, this.role);
    }

    public get isMember(): boolean {
        return CHAT_ROLE_HIERARCHY.hasRole(ChatRole.MEMBER, this.role);
    }

    public equal(other?: Participant | null): boolean {
        if (!other) return false;
        return this._id.equal(other.id);
    }

    public clone(): Participant {
        return Participant.restore(this.id, this.userId, this.chatId, this.role);
    }

    public static create(userId: Id, chatId: Id, role: ChatRole = ChatRole.MEMBER): Participant {
        const id = Id.create();
        return new Participant(id, userId, chatId, role);
    }

    public static restore(id: Id, userId: Id, chatId: Id, role: ChatRole): Participant {
        return new Participant(id, userId, chatId, role);
    }
}