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

  @Column("text", { nullable: false })
  username: string;

  @Column("text", { default: "user" })
  role: string;

  @Column("text", { nullable: false })
  hashedPassword: string;

  @CreateDateColumn()
  createdAt: Date;
}
