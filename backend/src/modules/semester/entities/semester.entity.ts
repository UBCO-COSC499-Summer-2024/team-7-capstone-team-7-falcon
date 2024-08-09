import { CourseModel } from '../../course/entities/course.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('semester_model')
export class SemesterModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'bigint' })
  starts_at: number;

  @Column({ type: 'bigint' })
  ends_at: number;

  @Column({ type: 'bigint' })
  created_at: number;

  @Column({ type: 'bigint' })
  updated_at: number;

  @OneToMany(() => CourseModel, (course) => course.semester)
  courses: CourseModel[];

  course_count?: number;
}
