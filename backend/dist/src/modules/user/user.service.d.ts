import { UserModel } from "./entities/user.entity";
import { OAuthGoogleUserPayload } from "../../common/interfaces";
import { UserEditDto } from "./dto/user-edit.dto";
export declare class UserService {
  getUserById(id: number): Promise<UserModel>;
  findOrCreateUser(
    userPayload: OAuthGoogleUserPayload,
    method: string,
  ): Promise<UserModel>;
  editUser(uid: number, userEditBody: UserEditDto): Promise<UserModel>;
  private findEmployeeNumber;
  private findStudentNumber;
}
