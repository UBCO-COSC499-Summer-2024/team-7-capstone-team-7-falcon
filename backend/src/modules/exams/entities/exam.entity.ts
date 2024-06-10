import { CourseModel } from 'src/modules/course/course.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { SubmissionModel } from './submission.entity';

@Entity('exam_model')
export class ExamModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'bigint' })
  created_at: number;

  @Column({ type: 'bigint' })
  updated_at: number;

  @Column({ type: 'date' }) // merged exam_date and released_at into one field
  exam_date: Date;

  @Column({ type: 'json' })
  questions: JSON;

  @ManyToOne(() => CourseModel, (course) => course.exams)
  @JoinColumn({ name: 'course_id' })
  course: CourseModel;

  @OneToMany(() => SubmissionModel, (submission) => submission.exam)
  submissions: SubmissionModel[];
}
