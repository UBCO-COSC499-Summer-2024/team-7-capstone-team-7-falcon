export interface CourseData {
  id?: number;
  course_code: string;
  course_name: string;
  section_name: string;
  semester_id: number;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
  updated_at: string;
  auth_type: string;
  email: string;
  password?: string | null;
  avatar_url: string;
}

export interface UpdatedUser {
  first_name: string;
  last_name?: string;
  role?: string;
  email?: string;
  password?: string | null;
  avatar_url?: string;
  employee_id?: number | null;
  student_id?: number | null;
  email_verified?: boolean;
}

export interface Course {
  id: number;
  course_code: string;
  course_name: string;
  semester_id: number;
  section_name: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
  invite_code: string;
}
export interface Exam {
  id: number;
  name: string;
  created_at: number;
  updated_at: number;
  exam_date: number;
  grades_released_at: number;
}

export interface Submission {
  student_id: string;
  user: {
    avatar_url: string;
    first_name: string;
    last_name: string;
  };
  score: number;
  updated_at: number;
}

export interface CourseRole {
  id: number;
  course_role: string;
  user: User;
  course: Course;
}

export interface StudentExamResult {
  exam_name: string;
  exam_date: number;
  payload?: JSON;
}

export interface Semester {
  id: number;
  name: string;
}

export interface ExamData {
  exam_name: string;
  exam_date: number;
  payload?: JSON;
}

// will be changed later once the form is actually made
export interface BubbleSheetPayload {
  payload: {
    numberOfQuestions: number;
    defaultPointsPerQuestion: number;
    numberOfAnswers: number;
    instructions: string;
    answers: number[];
  };
}

export interface ExamQuestion {
  question: string;
  answer: string;
}

export enum Status {
  Success = "SUCCESS",
  WrongCode = "WRONG CODE",
  Failure = "FAILURE",
  Pending = "PENDING",
  InvalidDate = "INVALID DATE",
  Redirect = "REDIRECT",
}

export enum FormValid {
  Valid = "VALID",
  Invalid = "INVALID",
  PasswordsDoNotMatch = "PASSWORDS DO NOT MATCH",
  WeakPassword = "WEAK PASSWORD",
  FirstNameLengthOutOfBounds = "FIRST NAME LENGTH OUT OF BOUNDS",
}

export enum EmailValid {
  Valid = "VALID",
  Invalid = "INVALID",
  Pending = "PENDING",
}

export interface SignUpFormData {
  first_name: string;
  last_name: string | null;
  email: string;
  password: string;
  confirm_password: string;
  student_id: number | null;
  employee_id: number | null;
}

export interface userLoginData {
  email: string;
  password: string;
}

export interface requestResetPasswordData {
  email: string;
}

export interface resetPasswordData {
  token: string;
  password: string;
  confirm_password: string;
}

// for authentication pages
export interface redirectModalData {
  message: string;
  redirectPath: string;
  buttonText: string;
}

export interface CourseUser {
  id: number;
  user: {
    avatar_url: string;
    first_name: string;
    last_name?: string;
    id: number;
    email: string;
  };
  course_role: string;
}

export enum SelectedButton {
  Create_Exam = "CREATE EXAM",
  People = "PEOPLE",
  Analytics = "ANALYTICS",
  None = "NONE",
}

export interface StudentSubmission {
  exam: {
    id: number;
    name: string;
    examDate: number;
  };
  studentSubmission: {
    id: number;
    score: number;
  };
  course: {
    id: number;
    courseName: string;
    courseCode: string;
  };
  grades: number[];
}
