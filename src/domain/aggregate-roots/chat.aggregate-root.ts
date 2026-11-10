import { AggregateRoot } from '@nestjs/cqrs';
import {
    ChatCreatedEvent,
    ChatDeletedEvent,
    ChatEvent,
    ChatInformationUpdatedEvent,
    MessageEvent,
    ParticipantCreatedEvent,
    ParticipantDeletedEvent,
    ParticipantEvent,
    ParticipantUpdatedEvent
} from "@sorokchat-messenger/shared-events";
import { Participant } from "../entities/index.js";
import { Id, ParticipantId, Role } from "../value-objects/index.js";
import {
    NotSelfException,
    MemberAlreadyExistsException,
    MemberNotAdminException,
    MemberNotFoundException,
    LastAdminException
} from "../exception/index.js";

export class Chat extends AggregateRoot<ChatEvent | ParticipantEvent | MessageEvent> {
    private readonly _id: Id;
    private _name: string;
    private _description: string | null;
    private _participants: Participant[];

    private _created: boolean;
    private _updated: boolean;
    private _deleted: boolean;

    private constructor(id: Id, name: string, description: string | null, participants: Participant[], isCreated: boolean) {
        super();
        this._id = id;
        this._name = name;
        this._description = description;
        this._participants = [...participants];
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

    public get id(): Id {
        return this._id.clone();
    }

    public get name(): string {
        return this._name;
    }

    public changeName(actorId: Id, name: string): Chat {
        if (!this.hasAdmin(actorId)) throw new MemberNotAdminException();
        if (this._name === name) return this;
        this._name = name;
        this.maskAsUpdated();
        this.applyOnce(new ChatInformationUpdatedEvent(this._id.value));
        return this;
    }

    public get description(): string | null {
        return this._description;
    }

    public changeDescription(actorId: Id, description: string): Chat {
        if (!this.hasAdmin(actorId)) throw new MemberNotAdminException();
        const cleaned = description.trim();
        if (cleaned === this._description) return this;
        if (cleaned.length) {
            this._description = cleaned;
            this.maskAsUpdated();
            this.applyOnce(new ChatInformationUpdatedEvent(this._id.value));
            return this;
        } else {
            return this.clearDescription();
        }
    }

    public get participants(): Participant[] {
        return this._participants.map(participant => participant.clone());
    }

    public hasAdmin(userId: Id): boolean {
        const participant = this.getParticipant(userId);
        return participant !== null ? participant.isAdmin : false;
    }

    public hasMember(userId: Id): boolean {
        const participant = this.getParticipant(userId);
        return participant !== null ? participant.isMember : false;
    }

    public hasParticipant(userId: Id): boolean {
        return this.getParticipant(userId) !== null;
    }

    public addMember(actorId: Id, userId: Id): Chat {
        if (actorId.equal(userId)) throw new NotSelfException();
        if (!this.hasAdmin(actorId)) throw new MemberNotAdminException();
        if (this.hasParticipant(userId)) throw new MemberAlreadyExistsException();
        this._participants.push(Participant.create(userId, this._id));
        this.maskAsUpdated();
        this.apply(new ParticipantCreatedEvent(this._id.value, userId.value));
        return this;
    }

    public removeMember(actorId: Id, userId: Id): Chat {
        if (actorId.equal(userId)) throw new NotSelfException();
        if (!this.hasAdmin(actorId)) throw new MemberNotAdminException();
        const participant = this.getParticipant(userId);
        if (participant === null) throw new MemberNotFoundException();
        participant.delete();
        this.maskAsUpdated();
        this.apply(new ParticipantDeletedEvent(this._id.value, userId.value));
        return this;
    }

    public leave(actorId: Id): Chat {
        const participant = this.getParticipant(actorId);
        if (participant === null) throw new MemberNotFoundException();
        if (participant.isAdmin && this.countOfAdmins <= 1) throw new LastAdminException();
        participant.delete();
        this.maskAsUpdated();
        this.apply(new ParticipantDeletedEvent(this._id.value, actorId.value));
        return this;
    }

    public changeRole(actorId: Id, userId: Id, role: Role): Chat {
        if (actorId.equal(userId)) throw new NotSelfException();
        if (!this.hasAdmin(actorId)) throw new MemberNotAdminException();
        const participant = this.getParticipant(userId);
        if (participant === null) throw new MemberNotFoundException();
        if (participant.role.equal(role)) return this;
        participant.changeRole(role);
        this.maskAsUpdated();
        this.apply(new ParticipantUpdatedEvent(this._id.value, userId.value));
        return this;
    }

    public delete(actorId: Id): Chat {
        if (!this.hasAdmin(actorId)) throw new MemberNotAdminException();
        this.markAsDeleted();
        this.applyOnce(new ChatDeletedEvent(this._id.value));
        return this;
    }

    private get countOfAdmins(): number {
        return this._participants.filter(participant => participant.isAdmin).length;
    }

    private clearDescription(): Chat {
        if (this._description === null) return this;
        this._description = null;
        this.maskAsUpdated();
        this.applyOnce(new ChatInformationUpdatedEvent(this._id.value));
        return this;
    }

    private getParticipant(userId: Id): Participant | null {
        const participantId = ParticipantId.of(userId, this._id)
        return this._participants.find(participant => participant.id.equal(participantId)) || null;
    }

    private maskAsUpdated(): void {
        this._created = false;
        this._updated = true;
        this._deleted = false;
    }

    private markAsDeleted(): void {
        this._created = false;
        this._updated = false;
        this._deleted = true;
    }

    public applyOnce(event: ChatEvent | ParticipantEvent | MessageEvent): void {
        const uncommitedEvents = this.getUncommittedEvents();
        const alreadyExists = uncommitedEvents.some(current => current.pattern === event.pattern);
        if (!alreadyExists) {
            super.apply(event);
        }
    }

    public equal(other: Chat): boolean {
        return this._id.equal(other.id);
    }

    public clone(): Chat {
        return Chat.restore(this.id, this.name, this.description, this.participants);
    }

    public static create(name: string, description: string | null, actorId: Id): Chat {
        const id: Id = Id.create();
        const chat = new Chat(id, name, description, [Participant.create(actorId, id, Role.ADMIN)], true);
        chat.applyOnce(new ChatCreatedEvent(id.value));
        return chat;
    }

    public static restore(id: Id, name: string, description: string | null, participants: Participant[]): Chat {
        return new Chat(id, name, description, participants.map(participant => participant.clone()), false);
    }
}