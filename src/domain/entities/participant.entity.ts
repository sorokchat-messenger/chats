import { CHAT_ROLE_HIERARCHY } from "@sorokchat-messenger/contracts";
import { Id, ParticipantId, Role } from "../value-objects/index.js";
import { Entity } from "./entity.js";

export class Participant extends Entity<Participant, ParticipantId> {
    private _role: Role;

    private _created: boolean;
    private _updated: boolean;
    private _deleted: boolean;

    private constructor(id: ParticipantId, role: Role, isCreated: boolean) {
        super(id);
        this._role = role;
        this._created = isCreated;
        this._updated = false;
        this._deleted = false;
    }

    public get isCreated(): boolean {
        return this._created;
    }

    public get isUpdated(): boolean {
        return this._updated;
    }

    public get isDeleted(): boolean {
        return this._deleted;
    }

    public get role(): Role {
        return this._role.clone();
    }

    public changeRole(role: Role): Participant {
        if (role.equal(this._role)) return this;
        this._role = role;
        this.markAsUpdated();
        return this;
    }

    public delete(): Participant {
        this.markAsDeleted();
        return this;
    }

    public get isAdmin(): boolean {
        return CHAT_ROLE_HIERARCHY.hasRole(Role.ADMIN.value, this.role.value);
    }

    public get isMember(): boolean {
        return CHAT_ROLE_HIERARCHY.hasRole(Role.MEMBER.value, this.role.value);
    }

    public clone(): Participant {
        return new Participant(this.id, this.role, false);
    }

    private markAsUpdated(): void {
        this._created = false;
        this._updated = true;
        this._deleted = false;
    }

    private markAsDeleted(): void {
        this._created = false;
        this._updated = false;
        this._deleted = true;
    }

    public static create(userId: Id, chatId: Id, role: Role = Role.MEMBER): Participant {
        return new Participant(ParticipantId.of(userId, chatId), role, true);
    }

    public static restore(userId: Id, chatId: Id, role: Role): Participant {
        return new Participant(ParticipantId.of(userId, chatId), role, false);
    }
}