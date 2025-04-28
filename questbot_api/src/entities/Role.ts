import { PrimaryGeneratedColumn, Entity, Column, ManyToMany, ManyToOne } from "typeorm";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: false })
  role: string;
}
