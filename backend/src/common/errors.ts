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
  constructor(message?: string) {
    super(message ?? ERROR_MESSAGES.authController.invalidAuthMethod);
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
  constructor(message?: string) {
    super(message ?? ERROR_MESSAGES.userController.userNotFound);
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

/**
 * Exception thrown when none of the student and employee fields are provided
 */
export class UserStudentEmployeeFieldException extends Error {
  constructor() {
    super(
      ERROR_MESSAGES.userController.userStudentEmployeeIdFieldsMissingError,
    );
  }
}

/**
 * Exception thrown when token is invalid or not found
 */
export class TokenInvalidException extends Error {
  constructor() {
    super(ERROR_MESSAGES.tokenController.invalidToken);
  }
}

/**
 * Exception thrown when token is expired
 */
export class TokenExpiredException extends Error {
  constructor() {
    super(ERROR_MESSAGES.tokenController.tokenExpired);
  }
}

/**
 * Exception thrown when email is not verified
 */
export class EmailNotVerifiedException extends Error {
  constructor() {
    super(ERROR_MESSAGES.authController.emailNotVerified);
  }
}

/**
 * Exception thrown when password is invalid
 */
export class InvalidPasswordException extends Error {
  constructor() {
    super(ERROR_MESSAGES.authController.invalidPassword);
  }
}

/**
 * Exception thrown when exam is not found
 */
export class ExamNotFoundException extends Error {
  constructor() {
    super(ERROR_MESSAGES.examController.examNotFound);
  }
}

/**
 * Exception thrown when user submission is not found
 */
export class UserSubmissionNotFound extends Error {
  constructor() {
    super(ERROR_MESSAGES.examController.userSubmissionNotFound);
  }
}

/**
 * Exception thrown when submission is not found
 */
export class SubmissionNotFoundException extends Error {
  constructor() {
    super(ERROR_MESSAGES.examController.submissionNotFound);
  }
}

/**
 * Exception thrown when file is not found
 */
export class FileNotFoundException extends Error {
  constructor() {
    super(ERROR_MESSAGES.common.fileNotFound);
  }
}

/**
 * Exception thrown when there is an error with course role
 */
export class CourseRoleException extends Error {
  constructor(message: string) {
    super(message);
  }
}
