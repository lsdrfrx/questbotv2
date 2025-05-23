import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from "typeorm";
import { Chat } from "./Chat";
import { Role } from "./Role";
import { Employee } from "./Employee";
import { Project } from "./Project";

@Entity()
export class Quest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: false, comment: "Название квеста" })
  questName: string;

  @Column("text", { array: true, nullable: false, comment: "Вопросы" })
  questions: string[];

  @Column("text", { nullable: true, comment: "Комментарий" })
  comment: string;

  @Column("text", { nullable: true, comment: "Напоминания" })
  reminders: string;

  @Column("text", { nullable: true, comment: "Дедлайн" })
  deadline: string;

  @Column("boolean", {
    default: true,
    comment: "Назначение времени пользователем",
  })
  timeSetByEmployee: boolean;

  @Column("text", { default: "40m", comment: "Время на ответ" })
  timeToAnswer: string;

  @Column("text", { nullable: true, comment: "Инкремент времени" })
  timeIncrement: string;

  @Column("text", { nullable: true, comment: "Следующий вопрос" })
  nextTime: string;

  @Column("integer", { nullable: true, comment: "Отсчет" })
  countdown: number;

  @Column("boolean", { default: true, comment: "Завершаемый" })
  finalizable: boolean;

  @Column("boolean", { default: true, comment: "Отправить в чат проекта" })
  sendToProjectChat: boolean;

  @Column("boolean", {
    default: true,
    comment: 'Отправить в чат "верхних" проектов',
  })
  sendToUpperProjects: boolean;

  @Column("boolean", { default: true, comment: "Отправить в чат Клуба" })
  sendToClubChat: boolean;

  @Column("boolean", { default: true, comment: "Отправить в чат бюро" })
  sendToBureauChat: boolean;

  @Column("boolean", { default: false, comment: "В процессе ответа" })
  inProgress: boolean;

  @Column("boolean", { default: false, comment: "Завершен" })
  finished: boolean;

  @ManyToOne(() => Project)
  project: Project;

  @ManyToOne(() => Employee, (employee) => employee.ongoingQuests)
  employee: Employee;

  @ManyToOne(() => Employee, (employee) => employee.listenedQuests)
  questioner: Employee;

  @ManyToMany(() => Employee)
  @JoinTable({ joinColumn: { name: "recepientEmployees_id" } })
  recepientEmployees: Employee[];

  @ManyToMany(() => Chat)
  @JoinTable({ joinColumn: { name: "recepientChats_id" } })
  recepientChats: Chat[];

  @ManyToOne(() => Role)
  role: Role;
}
