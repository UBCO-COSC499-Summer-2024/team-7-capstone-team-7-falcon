import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ExamModel } from './exam.entity';
import { StudentUserModel } from '../../../modules/user/entities/student-user.entity';
import { SubmissionDisputeModel } from './submission-dispute.entity';
import { UserSubmissionExamAnswersInterface } from 'src/common/interfaces';

@Entity('submission_model')
export class SubmissionModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  document_path: string;

  @Column({ type: 'float' })
  score: number;

  @Column({ type: 'bigint' })
  created_at: number;

  @Column({ type: 'bigint' })
  updated_at: number;

  @Column({ type: 'json', nullable: true, default: {} })
  answers: UserSubmissionExamAnswersInterface;

  @ManyToOne(() => ExamModel, (exam) => exam.submissions)
  @JoinColumn({ name: 'exam_id' })
  exam: ExamModel;

  @ManyToOne(() => StudentUserModel, (user) => user.submissions)
  @JoinColumn({ name: 'student_id' })
  student: StudentUserModel;

  @OneToOne(() => SubmissionDisputeModel, (dispute) => dispute.submission, {
    cascade: true,
  })
  @JoinColumn({ name: 'dispute_id' })
  dispute: SubmissionDisputeModel;
}
