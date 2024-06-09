import { Response } from "express";
import { AuthService } from "./auth.service";
export declare class AuthController {
  private readonly authService;
  private GOOGLE_AUTH_URL;
  constructor(authService: AuthService);
  oAuthProviderNegotiation(res: Response, _provider: string): void;
  oAuthProviderCallback(
    res: Response,
    _provider: string,
    code: string,
  ): Promise<Response<void> | void>;
  logout(res: Response): Response;
  private isSecure;
}
