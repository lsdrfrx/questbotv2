import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Project } from "./Project";
import { Quest } from "./Quest";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: false, comment: "Имя пользователя" })
  username: string;

  @Column("text", {
    nullable: false,
    comment: "Полное ФИО (Иванов Иван Иванович)",
  })
  usernameFull: string;

  @Column("text", { nullable: false, comment: "Краткое ФИО (Иванов И.И.)" })
  usernameShort: string;

  @Column("text", {
    nullable: false,
    comment: "ФИО в дательном падеже (Иванову И.И.)",
  })
  recepientName: string;

  @Column("text", {
    nullable: false,
    comment: "ФИО в родительном падеже (Иванова И.И.)",
  })
  questionerName: string;

  @Column("text", { nullable: false, comment: "Telegram ID" })
  tgId: string;

  @Column("boolean", { default: true, comment: "Активный" })
  active: boolean;

  @OneToMany(() => Project, (project) => project.responsibleEmployee)
  projects: Project[];

  @OneToMany(() => Quest, (quest) => quest.employee)
  ongoingQuests: Quest[];

  @OneToMany(() => Quest, (quest) => quest.questioner)
  listenedQuests: Quest[];
}
