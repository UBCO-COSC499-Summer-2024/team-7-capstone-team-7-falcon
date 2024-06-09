import { UserService } from "../user/user.service";
import { OAuth2Client } from "google-auth-library";
import { JwtService } from "@nestjs/jwt";
export declare class AuthService {
  private readonly userService;
  private jwtService;
  client: OAuth2Client;
  constructor(userService: UserService, jwtService: JwtService);
  signInWithGoogle(code: string): Promise<{
    access_token: string;
  }>;
}
