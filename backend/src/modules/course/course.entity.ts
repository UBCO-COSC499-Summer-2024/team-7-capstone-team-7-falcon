import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm";
import { CourseUser } from "./course_user.entity";
import { ExamModel } from "../exams/entities/exam.entity";

@Entity()
export class CourseModel extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    course_code: string;

    @Column()
    course_name: string;
    
    @Column({type: 'timestamp'})
    created_at: Date;

    @Column({type: 'timestamp'})
    updated_at: Date;

    // add term id later

    @Column()
    is_archived: boolean;

    @Column()
    invite_code: string;

    @Column()
    section_name: string;

    @OneToMany(() => CourseUser, (user) => user.course)
    users: CourseModel[];

    @OneToMany(() => ExamModel, (exam) => exam.course)
    exams: ExamModel[];
}