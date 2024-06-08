import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { OAuthGoogleUserPayload } from '../../common/interfaces';
import { OAuthGoogleErrorException } from '../../common/errors';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  client: OAuth2Client;

  /**
   * Constructor
   * @param userService {UserService} - The user service
   * @param jwtService {JwtService} - The jwt service
   */
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {
    this.client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );
  }

  /**
   * Sign in with Google method
   * @param code {string} - The code provided by Google to retrieve the user information
   * @returns {Promise<UserModel>} - The user object
   */
  async signInWithGoogle(code: string): Promise<{ access_token: string }> {
    const { tokens } = await this.client.getToken(code);

    const ticket = await this.client.verifyIdToken({
      idToken: tokens.id_token,
      audience: `${process.env.GOOGLE_CLIENT_ID}.apps.googleusercontent.com`,
    });

    const payload: TokenPayload | undefined = ticket.getPayload();

    if (!payload) {
      throw new OAuthGoogleErrorException();
    }

    if (!payload.email_verified) {
      throw new OAuthGoogleErrorException('Email not verified');
    }

    const { email, given_name, family_name, picture } = payload;

    const userPayload: OAuthGoogleUserPayload = {
      email,
      given_name,
      family_name,
      picture,
    };

    const user = await this.userService.findOrCreateUser(
      userPayload,
      'google_oauth',
    );

    return {
      access_token: this.jwtService.sign({ id: user.id }),
    };
  }
}
