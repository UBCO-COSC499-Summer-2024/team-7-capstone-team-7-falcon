import {
  BaseEntity,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserModel } from './user.entity';
import { SubmissionModel } from 'src/modules/exams/entities/submission.entity';

@Entity('student_user_model')
export class StudentUserModel extends BaseEntity {
  @PrimaryColumn()
  student_id: number;

  @OneToOne(() => UserModel, (user) => user.student_user)
  user: UserModel;

  @OneToMany(() => SubmissionModel, (submission) => submission.student)
  submissions: SubmissionModel[];
}
