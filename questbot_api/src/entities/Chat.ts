import { PrimaryGeneratedColumn, Entity, Column } from "typeorm";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: false, comment: "Telegram ID чата" })
  tgId: string;

  @Column("text", { nullable: false, comment: "Название" })
  name: string;
}
