import { BaseEntity } from "typeorm";
import { UserModel } from "./user.entity";
export declare class EmployeeUserModel extends BaseEntity {
  id: number;
  user: UserModel;
  employee_id: number;
}
