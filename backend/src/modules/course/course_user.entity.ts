import { UserRoleEnum } from 'src/enums/user.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserModel } from '../user/entities/user.entity';
import { CourseModel } from './course.entity';

@Entity('course_user_model')
export class CourseUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  course_role: UserRoleEnum;

  @ManyToOne(() => UserModel, (user) => user.courses)
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @ManyToOne(() => CourseModel, (course) => course.users)
  @JoinColumn({ name: 'course_id' })
  course: CourseModel;
}
