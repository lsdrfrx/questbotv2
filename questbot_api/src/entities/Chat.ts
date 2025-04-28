import { PrimaryGeneratedColumn, Entity, Column, ManyToMany } from "typeorm";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: false })
  tgId: string;

  @Column("text", { nullable: false })
  name: string;
}
