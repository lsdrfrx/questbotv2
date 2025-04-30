import moment from "moment";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  JoinTable,
} from "typeorm";
import { User } from "./User";
import { Employee } from "./Employee";
import { Chat } from "./Chat";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: false })
  projectName: string;

  @Column("text", { nullable: true })
  projectNameFull: string;

  @Column("text", { nullable: true })
  branch: string;

  @Column("text", { nullable: true })
  bureau: string;

  @Column("integer", { default: Number(moment().format("YYYY")) })
  startYear: number;

  @Column("text", { nullable: true })
  contractorName: string;

  @Column("text", { nullable: true })
  contractorOrganization: string;

  @ManyToOne(() => Employee, (employee) => employee.projects)
  responsibleEmployee: Employee;

  @ManyToOne(() => Chat)
  chat: Chat;

  @ManyToMany(() => Project, { cascade: true })
  @JoinTable({ joinColumn: { name: "subproject_id" } })
  subprojects: Project[];
}
