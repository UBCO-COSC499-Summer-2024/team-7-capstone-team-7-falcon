import { ERROR_MESSAGES } from '.';

/**
 * Exception to be thrown when a user already exists with a different auth type
 */
export class UserAlreadyExistsException extends Error {
  constructor() {
    super(ERROR_MESSAGES.authController.userAlreadyExists);
  }
}

/**
 * Exception to be thrown when an invalid auth method is provided
 */
export class InvalidAuthMethodException extends Error {
  constructor() {
    super(ERROR_MESSAGES.authController.invalidAuthMethod);
  }
}

/**
 * Exception to be thrown when an error occurs authenticating with Google
 */
export class OAuthGoogleErrorException extends Error {
  constructor(message?: string) {
    super(message ?? ERROR_MESSAGES.authController.googleAuthError);
  }
}
