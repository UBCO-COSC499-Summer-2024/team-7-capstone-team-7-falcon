export const ERROR_MESSAGES = {
  userController: {
    userNotFound: 'User not found',
    editForbidden: 'You are not allowed to edit this user',
    employeeIdAlreadyExists: 'Employee ID already exists',
    studentIdAlreadyExists: 'Student ID already exists',
  },
  authController: {
    userAlreadyExists: 'User already exists with different auth type',
    invalidAuthMethod: 'Invalid auth method',
    googleAuthError: 'Error authenticating with Google',
  },
  userEditDto: {
    firstNameString: 'First name must be a string',
    firstNameRequired: 'First name is required',
    firstNameLength: 'First name must be between 2 and 15 characters',
    studentNumberMustBeNumber: 'Student number must be a number',
    studentNumberMustBeGreater: 'Student number must be greater than 0',
    employeeNumberMustBeNumber: 'Employee number must be a number',
    employeeNumberMustBeGreater: 'Employee number must be greater than 0',
  },
  courseController: {
    courseNotFound: 'Course not found',
    invalidInviteCode: 'Invalid invite code',
    uniqueConstraintViolation: 'Unique constraint violated',
    courseCreationFailed: 'Course could not be created',
    courseSearchFailed: 'Courses could not be found',
    courseArchived: 'Course is archived. Cannot be accessed.',
  },
  courseEnrollDto: {
    inviteCodeRequired: 'Invite code is required',
  },
  other: {
    unidentifiedException: 'Unidentified exception',
  },
};
