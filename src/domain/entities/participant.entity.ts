import { CHAT_ROLE_HIERARCHY } from "@sorokchat-messenger/contracts";
import { Id, ParticipantId, Role } from "../value-objects/index.js";
import { Entity } from "./entity.js";

export class Participant extends Entity<Participant, ParticipantId> {
    private _role: Role;

    public get role(): Role {
        return this._role.clone();
    }

    public changeRole(role: Role): Participant {
        if (!role.equal(this._role)) {
            this._role = role;
        }
        return this;
    }

    private constructor(id: ParticipantId, role: Role) {
        super(id);
        this._role = role;
    }

    public get isAdmin(): boolean {
        return CHAT_ROLE_HIERARCHY.hasRole(Role.ADMIN.value, this.role.value);
    }

    public get isMember(): boolean {
        return CHAT_ROLE_HIERARCHY.hasRole(Role.MEMBER.value, this.role.value);
    }

    public clone(): Participant {
        return new Participant(this.id, this.role);
    }

    public static create(userId: Id, chatId: Id, role: Role = Role.MEMBER): Participant {
        return new Participant(ParticipantId.of(userId, chatId), role);
    }

    public static restore(userId: Id, chatId: Id, role: Role): Participant {
        return new Participant(ParticipantId.of(userId, chatId), role);
    }
}