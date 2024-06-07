import { BaseEntity, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { UserModel } from './user.entity';

@Entity('student_user_model')
export class StudentUserModel extends BaseEntity {
  @PrimaryColumn()
  student_id: number;

  @OneToOne(() => UserModel, (user) => user.student_user)
  user: UserModel;
}
