import { CHAT_ROLE_HIERARCHY } from "@sorokchat-messenger/contracts";
import { Id } from "./id.model.js";
import { Role } from "./role.js";

export class Participant {
    private readonly _id: Id;
    private readonly _userId: Id;
    private readonly _chatId: Id;
    private _role: Role;

    public get id(): Id {
        return this._id.clone();
    }

    public get userId(): Id {
        return this._userId.clone();
    }

    public get chatId(): Id {
        return this._chatId.clone();
    }

    public get role(): Role {
        return this._role;
    }

    public changeRole(role: Role): Participant {
        this._role = role;
        return this;
    }

    private constructor(id: Id, userId: Id, chatId: Id, role: Role) {
        this._id = id;
        this._userId = userId;
        this._chatId = chatId;
        this._role = role;
    }

    public get isAdmin(): boolean {
        return CHAT_ROLE_HIERARCHY.hasRole(Role.ADMIN, this.role);
    }

    public get isMember(): boolean {
        return CHAT_ROLE_HIERARCHY.hasRole(Role.MEMBER, this.role);
    }

    public equal(other?: Participant | null): boolean {
        if (!other) return false;
        return this._id.equal(other.id);
    }

    public clone(): Participant {
        return Participant.restore(this.id, this.userId, this.chatId, this.role);
    }

    public static create(userId: Id, chatId: Id, role: Role = Role.MEMBER): Participant {
        const id = Id.create();
        return new Participant(id, userId, chatId, role);
    }

    public static restore(id: Id, userId: Id, chatId: Id, role: Role): Participant {
        return new Participant(id, userId, chatId, role);
    }
}