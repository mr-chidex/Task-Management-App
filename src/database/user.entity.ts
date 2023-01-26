import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Entity,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
import { Task } from './tasks.entity';

@Entity('users')
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  //eager set to true: whenever we retrieve the user we can access user.tasks immediately, and
  //get an array of tasks owned by the user. Only one side can have the eager true prop
  @OneToMany((task) => Task, (task) => task.user, { eager: true })
  tasks: Task[];
}
