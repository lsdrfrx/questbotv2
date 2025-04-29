import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Project } from "./Project";
import { Quest } from "./Quest";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: false })
  username: string;

  @Column("text", { nullable: false })
  usernameFull: string;

  @Column("text", { nullable: false })
  usernameShort: string;

  @Column("text", { nullable: false })
  recepientName: string;

  @Column("text", { nullable: false })
  questionerName: string;

  @Column("text", { nullable: false })
  tgId: string;

  @Column("boolean", { default: true })
  active: boolean;

  @OneToMany(() => Project, (project) => project.responsibleUser)
  projects: Project[];

  @OneToMany(() => Quest, (quest) => quest.employee)
  ongoingQuests: Quest[];

  @OneToMany(() => Quest, (quest) => quest.questioner)
  listenedQuests: Quest[];
}
