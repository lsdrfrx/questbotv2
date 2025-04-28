import moment from "moment";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from "typeorm";
import { User } from "./User";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: false })
  projectName: string;

  @Column("text")
  projectNameFull: string;

  @Column("text")
  projectChat: string;

  @Column("text")
  branch: string;

  @Column("text")
  bureau: string;

  @Column("integer", { default: Number(moment().format("YYYY")) })
  startYear: number;

  @Column("text")
  contractorName: string;

  @Column("text")
  contractorOrganization: string;

  @OneToMany(() => User, (user) => user.projects)
  responsibleUser: User;

  @ManyToMany(() => Project)
  subprojects: Project[];
}
