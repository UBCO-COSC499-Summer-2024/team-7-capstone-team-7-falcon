import { BaseEntity } from "typeorm";
import { UserModel } from "./user.entity";
export declare class StudentUserModel extends BaseEntity {
  student_id: number;
  user: UserModel;
}
