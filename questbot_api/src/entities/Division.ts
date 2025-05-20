import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from "typeorm";
import { Employee } from "./Employee";
import { Chat } from "./Chat";

@Entity()
export class Division {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: false, comment: "Подразделение" })
  entity: string;

  @Column("text", { nullable: false, comment: "Название" })
  name: string;

  @ManyToOne(() => Chat)
  chat: Chat;

  @ManyToOne(() => Employee)
  leader: Employee;
}
