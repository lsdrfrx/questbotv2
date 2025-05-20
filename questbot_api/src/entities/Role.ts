import { PrimaryGeneratedColumn, Entity, Column } from "typeorm";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: false, comment: "Название" })
  role: string;
}
