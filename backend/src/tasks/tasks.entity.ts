import { User } from "src/users/users.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ default: false })
    completed: boolean;

    @ManyToOne(() => User, (user) => user.tasks, { onDelete: "CASCADE" })
    user: User;
}