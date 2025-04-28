import { PrimaryGeneratedColumn, Entity, Column, OneToMany, ManyToMany } from "typeorm";
import { User } from "./User";
import { Chat } from "./Chat";

@Entity()
export class Quest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: false })
  questName: string;

  @Column("text", { nullable: false })
  role: string;

  @Column("text", { array: true, nullable: false })
  questions: string[];

  @Column("text")
  comment: string;
  
  @Column("timestamptz", { array: true })
  reminders: Date[];

  @Column("timestamptz")
  deadline: Date;

  @Column("boolean", { default: true })
  timeSetByUser: boolean;

  @Column("integer", { default: 60 * 40 })
  timeToAnswer: number;

  @Column("text")
  iteration: string;

  @Column("timestamptz")
  nextTime: Date[]

  @Column("integer")
  countdown: number;

  @Column("boolean", { default: true })
  finalizable: boolean;

  @Column("boolean", { default: true })
  sendToProjectChat: boolean;

  @Column("boolean", { default: true })
  sendToUpperProjects: boolean;
  
  @Column("boolean", { default: true })
  sendToClubChat: boolean;

  @Column("boolean", { default: true })
  sendToBureauChat: boolean;

  @Column("boolean", { default: false })
  inProgress: boolean;

  @OneToMany(() => User, (user) => user.ongoingQuests)
  employee: User;

  @OneToMany(() => User, (user) => user.listenedQuests)
  questioner: User;

  @ManyToMany(() => User)
  recepientUsers: User[];

  @ManyToMany(() => Chat)
  recepientChats: Chat[];
}
