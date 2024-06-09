import { AuthTypeEnum, UserRoleEnum } from "../../../enums/user.enum";
import { BaseEntity } from "typeorm";
import { EmployeeUserModel } from "./employee-user.entity";
import { StudentUserModel } from "./student-user.entity";
export declare class UserModel extends BaseEntity {
  id: number;
  first_name: string;
  last_name: string;
  role: UserRoleEnum;
  created_at: number;
  updated_at: number;
  auth_type: AuthTypeEnum;
  email: string;
  password: string;
  employee_user: EmployeeUserModel;
  student_user: StudentUserModel;
}
