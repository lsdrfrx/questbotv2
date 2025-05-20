import moment from "moment";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from "typeorm";
import { Employee } from "./Employee";
import { Chat } from "./Chat";
import { Division } from "./Division";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: false, comment: "Название проекта" })
  projectName: string;

  @Column("text", { nullable: true, comment: "Полное название проекта" })
  projectNameFull: string;

  @Column("integer", {
    default: Number(moment().format("YYYY")),
    comment: "Год начала",
  })
  startYear: number;

  @Column("text", { nullable: true, comment: "Имя заказчика" })
  contractorName: string;

  @Column("text", { nullable: true, comment: "Организация заказчика" })
  contractorOrganization: string;

  @ManyToOne(() => Employee, (employee) => employee.projects)
  responsibleEmployee: Employee;

  @ManyToOne(() => Chat)
  chat: Chat;

  @ManyToOne(() => Division)
  branch: Division;

  @ManyToOne(() => Division)
  bureau: Division;

  @ManyToOne(() => Division)
  club: Division;

  @ManyToMany(() => Project, { cascade: true })
  @JoinTable({ joinColumn: { name: "subproject_id" } })
  subprojects: Project[];
}
