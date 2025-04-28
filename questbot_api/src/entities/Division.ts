import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Division {
  @PrimaryGeneratedColumn()
  id: number;
}
