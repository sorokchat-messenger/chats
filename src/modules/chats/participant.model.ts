import { CHAT_ROLE_HIERARCHY, ChatRole } from "@sorokchat-messenger/contracts";

export class ParticipantModel {
    private readonly _id: number;
    private readonly _userId: number;
    private _role: ChatRole;

    private constructor(id: number, userId: number, role: ChatRole) {
        this._id = id;
        this._userId = userId;
        this._role = role;
    }

    public get id(): number {
        return this._id;
    }

    public get userId(): number {
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

    public static createAdmin(userId: number): ParticipantModel {
        return new ParticipantModel(null!, userId, ChatRole.ADMIN);
    }

    public static createMember(userId: number): ParticipantModel {
        return new ParticipantModel(null!, userId, ChatRole.MEMBER);
    }

    public static fromStorage(id: number, userId: number, role: ChatRole): ParticipantModel {
        return new ParticipantModel(id, userId, role);
    }
}