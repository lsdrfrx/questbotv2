import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: false, comment: "Имя пользователя" })
  username: string;

  @Column("text", { default: "user", comment: "Полномочия" })
  role: string;

  @Column("text", { nullable: false, comment: "Пароль" })
  hashedPassword: string;

  @CreateDateColumn({ comment: "Дата создания" })
  createdAt: Date;
}
