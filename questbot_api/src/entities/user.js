import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity
export class User {
  @PrimaryGeneratedColumn()
  id;

  @Column()
  username;

  @Column()
  usernameFull;

  @Column()
  usernameShort;
}
