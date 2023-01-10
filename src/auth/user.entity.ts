import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Entity,
  Column,
  Unique,
} from 'typeorm';

@Entity('users')
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;
}
