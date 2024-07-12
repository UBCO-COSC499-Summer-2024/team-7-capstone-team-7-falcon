import { AuthTypeEnum, UserRoleEnum } from '../../../enums/user.enum';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeeUserModel } from './employee-user.entity';
import { StudentUserModel } from './student-user.entity';
import { Exclude } from 'class-transformer';
import { CourseUserModel } from '../../course/entities/course-user.entity';
import { TokenModel } from '../../token/entities/token.entity';

@Entity('user_model')
export class UserModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column({ nullable: true })
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

  @Column({ default: false })
  email_verified: boolean;

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

  @OneToMany(() => CourseUserModel, (courseUser) => courseUser.user)
  courses: CourseUserModel[];

  @OneToMany(() => TokenModel, (token) => token.user)
  tokens: TokenModel[];
}
