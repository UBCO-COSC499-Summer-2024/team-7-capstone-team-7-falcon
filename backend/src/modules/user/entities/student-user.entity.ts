import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserModel } from './user.entity';
import { SubmissionModel } from '../../../modules/exam/entities/submission.entity';

@Entity('student_user_model')
export class StudentUserModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  student_id: number;

  @OneToOne(() => UserModel, (user) => user.student_user)
  user: UserModel;

  @OneToMany(() => SubmissionModel, (submission) => submission.student)
  submissions: SubmissionModel[];
}
