import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserModel } from '../user/entities/user.entity';

@Injectable()
export class MailService {
  /**
   * Constructor of MailService
   * @param mailerService {MailerService} - Instance of MailerService
   */
  constructor(private readonly mailerService: MailerService) {}

  /**
   * Send user confirmation email
   * @param user {UserModel} - User model
   * @param token {string} - Token
   */
  async sendUserConfirmation(user: UserModel, token: string): Promise<void> {
    const url = `${process.env.FRONTEND_URL}/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Confirm your email',
      template: './email-confirmation',
      context: {
        url,
        name: user.first_name,
      },
    });
  }

  /**
   * Send password reset email
   * @param user {UserModel} - User model
   * @param token {string} - Token id
   */
  async sendPasswordReset(user: UserModel, token: string): Promise<void> {
    const url = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset your password',
      template: './password-reset',
      context: {
        url,
        name: user.first_name,
      },
    });
  }
}
