import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserModel } from './user.entity';

@Entity('employee_user_model')
export class EmployeeUserModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserModel, (user) => user.employee_user)
  user: UserModel;

  @Column({ nullable: true })
  employee_id: number;
}
