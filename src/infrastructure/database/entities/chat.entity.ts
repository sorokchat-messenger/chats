import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ParticipantEntity } from "./participant.entity";

@Entity({ name: "chats" })
export class ChatEntity {
    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column({ name: "name", nullable: false, type: "varchar" })
    public name: string;

    @Column({ name: "description", nullable: true, type: "varchar" })
    public description: string | null;

    @OneToMany(() => ParticipantEntity, participant => participant.chat)
    public participants: ParticipantEntity[] = [];
}