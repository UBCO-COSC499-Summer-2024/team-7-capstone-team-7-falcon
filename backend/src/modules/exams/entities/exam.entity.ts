import { CourseModel } from "src/modules/course/course.entity";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, JoinColumn} from "typeorm";
import { SubmissionModel } from "./submission.entity";

@Entity()
export class ExamModel extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column({type: 'timestamp'})
    created_at: Date;
    
    @Column({type: 'timestamp'})
    updated_at: Date;
    
    @Column({type: 'date'}) // merged exam_date and released_at into one field
    exam_date: Date;

    @Column({type: 'json'})
    questions: JSON;

    @ManyToOne(() => CourseModel, (course) => course.exams)
    @JoinColumn({ name: 'course_id' })
    course: CourseModel;

    @OneToMany(() => SubmissionModel, (submission) => submission.exam)
    submissions: SubmissionModel[];
}