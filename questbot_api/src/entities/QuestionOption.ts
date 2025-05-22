import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class QuestionOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("boolean", {
    default: false,
    comment: "Завершает ли данный ответ квест",
  })
  finalizing: boolean;

  @Column("text", { nullable: false, comment: "Текст варианта ответа" })
  text: string;
}
