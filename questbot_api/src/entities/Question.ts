import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { QuestionOption } from "./QuestionOption";

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: false, comment: "Текст вопроса" })
  text: string;

  @ManyToMany(() => QuestionOption)
  @JoinTable({ joinColumn: { name: "questionOption_id" } })
  options: QuestionOption[];
}
