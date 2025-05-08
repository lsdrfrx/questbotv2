import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from "typeorm";
import { Employee } from "./Employee";
import { Chat } from "./Chat";

@Entity()
export class Division {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  entity: string;

  @Column("text")
  name: string;

  @ManyToOne(() => Chat)
  chat: Chat;

  @ManyToOne(() => Employee)
  leader: Employee;
}
