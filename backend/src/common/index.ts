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
  },
  courseEnrollDto: {
    inviteCodeRequired: 'Invite code is required',
  },
  semesterCreateDto: {
    nameRequired: 'Name is required',
    nameLength: 'Name must be between 2 and 15 characters',
    startsAtRequired: 'Start date is required',
    endsAtRequired: 'End date is required',
  },
  semesterController: {
    semesterStartDateMustBeBeforeEndDate: 'Start date must be before end date',
    semesterStartDateMustBeTwoDaysAhead:
      'Start date must be at least two days ahead',
  },
};
