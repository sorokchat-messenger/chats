import { ChatRole } from "@sorokchat-messenger/contracts";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChatEntity } from "./chat.entity";

@Index(["chat", "userId"], { unique: true })
@Index(["userId"])
@Entity({ name: "participants" })
export class ParticipantEntity {
    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column({ name: "user_id", nullable: false, type: "int" })
    public userId: number;

    @Column({ nullable: false, default: ChatRole.MEMBER, type: "varchar" })
    public role: ChatRole;

    @ManyToOne(() => ChatEntity, chat => chat.participants, { onDelete: "CASCADE", nullable: false })
    @JoinColumn({ name: "chat_id" })
    public chat: ChatEntity;
}