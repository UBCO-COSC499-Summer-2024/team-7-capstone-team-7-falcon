import { Response } from "express";
import { UserService } from "./user.service";
import { UserEditDto } from "./dto/user-edit.dto";
import { UserModel } from "./entities/user.entity";
export declare class UserController {
  private readonly userService;
  constructor(userService: UserService);
  get(req: Request, res: Response): Promise<Response>;
  getById(res: Response, uid: number): Promise<Response>;
  edit(
    res: Response,
    uid: number,
    body: UserEditDto,
    user: UserModel,
  ): Promise<Response>;
}
