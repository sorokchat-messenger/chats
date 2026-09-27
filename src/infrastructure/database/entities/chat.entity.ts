import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "chats" })
export class ChatEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ name: "name", nullable: false })
    public name: string;

    @Column({ name: "description", nullable: true })
    public description: string | null;
}