import { AuthTypeEnum, UserRoleEnum } from '../../../enums/user.enum';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeeUserModel } from './employee-user.entity';
import { StudentUserModel } from './student-user.entity';
import { Exclude } from 'class-transformer';

@Entity('user_model')
export class UserModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ default: UserRoleEnum.STUDENT })
  role: UserRoleEnum;

  @Column({ type: 'bigint' })
  created_at: number;

  @Column({ type: 'bigint' })
  updated_at: number;

  @Column({ default: AuthTypeEnum.EMAIL })
  auth_type: AuthTypeEnum;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  avatar_url: string;

  @OneToOne(() => EmployeeUserModel, (employee_user) => employee_user.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'employee_id' })
  @Exclude()
  employee_user: EmployeeUserModel;

  @OneToOne(() => StudentUserModel, (student_user) => student_user.user, {
    cascade: true,
  })
  @JoinColumn({ name: 'student_id' })
  @Exclude()
  student_user: StudentUserModel;
}
