import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubmissionModel } from './submission.entity';
import { DisputeStatusEnum } from '../../../enums/exam-dispute.enum';

@Entity('submission_dispute_model')
export class SubmissionDisputeModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @OneToOne(() => SubmissionModel, (submission) => submission.dispute)
  submission: SubmissionModel;

  @Column({ type: 'bigint', nullable: true })
  created_at: number;

  @Column({ type: 'bigint', nullable: true })
  updated_at: number;

  @Column({ type: 'bigint', nullable: true })
  resolved_at: number;

  @Column({ nullable: true, default: DisputeStatusEnum.CREATED })
  status: DisputeStatusEnum;
}
