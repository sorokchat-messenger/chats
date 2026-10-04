import { CHAT_ROLE_HIERARCHY, ChatRole } from "@sorokchat-messenger/contracts";
import { uuidv7 } from "uuidv7";

export class ParticipantModel {
    private readonly _id: string;
    private readonly _userId: string;
    private _role: ChatRole;

    private constructor(id: string, userId: string, role: ChatRole) {
        this._id = id;
        this._userId = userId;
        this._role = role;
    }

    public get id(): string {
        return this._id;
    }

    public get userId(): string {
        return this._userId;
    }

    public get role(): ChatRole {
        return this._role;
    }

    public get isMember(): boolean {
        return CHAT_ROLE_HIERARCHY.hasRole(ChatRole.MEMBER, this._role);
    }

    public get isAdmin(): boolean {
        return CHAT_ROLE_HIERARCHY.hasRole(ChatRole.ADMIN, this._role);
    }

    public changeRole(role: ChatRole): void {
        this._role = role;
    }

    public static createAdmin(userId: string): ParticipantModel {
        return new ParticipantModel(uuidv7(), userId, ChatRole.ADMIN);
    }

    public static createMember(userId: string): ParticipantModel {
        return new ParticipantModel(uuidv7(), userId, ChatRole.MEMBER);
    }

    public static fromStorage(id: string, userId: string, role: ChatRole): ParticipantModel {
        return new ParticipantModel(id, userId, role);
    }
}