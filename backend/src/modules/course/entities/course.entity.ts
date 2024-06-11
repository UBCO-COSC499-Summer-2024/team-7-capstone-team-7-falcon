import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { CourseUserModel } from './course-user.entity';
import { ExamModel } from '../../exams/entities/exam.entity';
import { SemesterModel } from '../../semesters/entities/semester.entity';

@Entity('course_model')
export class CourseModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  course_code: string;

  @Column()
  course_name: string;

  @Column({ type: 'bigint' })
  created_at: number;

  @Column({ type: 'bigint' })
  updated_at: number;

  // add term id later

  @Column({ default: false })
  is_archived: boolean;

  @Column()
  invite_code: string;

  @Column()
  section_name: string;

  @OneToMany(() => CourseUserModel, (user) => user.course)
  users: CourseUserModel[];

  @OneToMany(() => ExamModel, (exam) => exam.course)
  exams: ExamModel[];

  @ManyToOne(() => SemesterModel, (semester) => semester.courses)
  semester: SemesterModel;
}
