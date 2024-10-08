export const ERROR_MESSAGES = {
  common: {
    passwordString: 'Password must be a string',
    passwordRequired: 'Password is required',
    confirmPasswordRequired: 'Confirmation password is required',
    confirmPasswordString: 'Confirmation password must be a string',
    passwordStrong:
      'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase ' +
      'letter, one number, and one symbol',
    passwordMustMatch: 'Password and confirmation password do not match',
    emailRequired: 'Email is required',
    emailInvalid: 'Email is invalid',
    fileNotFound: 'File not found',
    invalid2DArray: 'Answers array must be a 2D array of numbers',
  },
  userRoleDto: {
    userRoleInvalid: 'User role is invalid',
    userRoleRequired: 'User role is required',
  },
  userController: {
    userNotFound: 'User not found',
    editForbidden: 'You are not allowed to edit this user',
    employeeIdAlreadyExists: 'Employee ID already exists',
    studentIdAlreadyExists: 'Student ID already exists',
    userStudentEmployeeIdFieldsMissingError:
      'Student or employee ID fields are missing',
  },
  authController: {
    userAlreadyExists: 'User already exists with different auth type',
    invalidAuthMethod: 'Invalid auth method',
    googleAuthError: 'Error authenticating with Google',
    emailNotVerified: 'Email not verified',
    notSupportedAuthType: 'User account has unsupported authentication type',
    invalidPassword: 'Invalid password',
    studentOrEmployeeIdNotPresent: 'Student or Employee ID is missing',
  },
  tokenController: {
    invalidToken: 'Invalid token',
    tokenExpired: 'Token has expired',
    tokenRequired: 'Token is required',
    tokenString: 'Token must be a string',
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
  userCreateDto: {
    emailRequired: 'Email is required',
    passwordString: 'Password must be a string',
    passwordRequired: 'Password is required',
    confirmPasswordRequired: 'Confirmation password is required',
    confirmPasswordString: 'Confirmation password must be a string',
    passwordStrong:
      'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol',
    passwordMustMatch: 'Password and confirmation password do not match',
  },
  courseController: {
    courseNotFound: 'Course not found',
    invalidInviteCode: 'Invalid invite code',
    uniqueConstraintViolation: 'Unique constraint violated',
    courseCreationFailed: 'Course could not be created',
    coursesNotFound: 'Courses could not be found',
    courseArchived: 'Course is archived. Cannot be accessed.',
    userNotEnrolledInCourse: 'User is not enrolled in the course',
    deleteStudentFromCourseError:
      'User cannot be deleted from course as their role is not student',
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
    semesterNotFound: 'Semester not found',
    semestersNotFound: 'Semesters not found',
  },
  queueController: {
    jobNotFound: 'Job not found',
    queueNotFound: 'Queue not found',
  },
  examController: {
    examDateError: 'Exam date must be in the future',
    examNameTooLong: 'Exam name is too long',
    noUpcomingExamsFound: 'No upcoming exams found',
    noGradedExamsFound: 'No graded exams found',
    examNotFound: 'Exam not found',
    examsNotFound: 'Exams not found',
    submissionNotFound: 'Submission not found',
    userSubmissionNotFound: 'User submission not found',
    examFilesAlreadyUploaded: 'Exam files have already been uploaded',
    examFilesInvalid: 'Exam files are invalid, make sure they are PDFs',
    examFilesMissing: 'Answer key and submission file are required',
    disputeAlreadyExists: 'Dispute already exists for this submission',
    submissionDoesNotBelongToUser: 'Submission does not belong to user',
    disputesNotFound: 'Disputes not found',
    disputeNotFound: 'Dispute not found',
    userAlreadyAssignedToThisSubmission:
      'User is already assigned to this submission',
    userAlreadyAssignedToSubmission: 'User is already assigned to a submission',
  },
  submissionController: {
    submissionNotFound: 'Submission not found',
    minGradeError: 'Minimum grade must be 0',
    maxGradeError: 'Maximum grade must be 100',
    invalidGradeError: 'Grade value is not valid',
  },
};
