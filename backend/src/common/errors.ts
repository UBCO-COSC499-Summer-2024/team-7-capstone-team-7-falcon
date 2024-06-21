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

/**
 * Exception to be thrown when a user is not found
 */
export class UserNotFoundException extends Error {
  constructor() {
    super(ERROR_MESSAGES.userController.userNotFound);
  }
}

/**
 * Exception to be thrown when a user is not allowed to edit / create employee ID
 */
export class EmployeeIdAlreadyExistsException extends Error {
  constructor() {
    super(ERROR_MESSAGES.userController.employeeIdAlreadyExists);
  }
}

/**
 * Exception to be thrown when a user is not allowed to edit another user
 */
export class StudentIdAlreadyExistsException extends Error {
  constructor() {
    super(ERROR_MESSAGES.userController.studentIdAlreadyExists);
  }
}

/**
 * Exception to be thrown when a course is not found
 */
export class CourseNotFoundException extends Error {
  constructor(message?: string) {
    super(message ?? ERROR_MESSAGES.courseController.courseNotFound);
  }
}

/**
 * Exception to be thrown when an invalid invite code is provided
 */
export class InvalidInviteCodeException extends Error {
  constructor() {
    super(ERROR_MESSAGES.courseController.invalidInviteCode);
  }
}

/**
 * Exception to be thrown when an invalid invite code is provided
 */
export class UniqueConstraintException extends Error {
  constructor() {
    super(ERROR_MESSAGES.courseController.uniqueConstraintViolation);
  }
}

/**
 * Exception to be thrown when a course instance from an archived course is accessed
 */
export class CourseArchivedException extends Error {
  constructor() {
    super(ERROR_MESSAGES.courseController.courseArchived);
  }
}

/**
 * Exception to be thrown when a semester cannot be found
 */
export class SemesterNotFoundException extends Error {
  constructor() {
    super(ERROR_MESSAGES.semesterController.semesterNotFound);
  }
}

/**
 * Exception to be thrown when semester is not possible to create
 */
export class SemesterCreationException extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Exception to be thrown when a job creation fails
 */
export class JobCreationException extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Exception to be thrown when a job could not be completed
 */
export class CouldNotCompleteJobException extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Exception to be thrown when a job is not found
 */
export class JobNotFoundException extends Error {
  constructor() {
    super(ERROR_MESSAGES.queueController.jobNotFound);
  }
}

/**
 * Exception to be thrown when exam was failed to create
 */
export class ExamCreationException extends Error {
  constructor(message: string) {
    super(message);
  }
}
