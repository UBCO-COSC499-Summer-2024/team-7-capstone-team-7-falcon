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

export interface CourseRole {
  id: number;
  course_role: string;
  user: User;
  course: Course;
}

export interface Semester {
  id: number;
  name: string;
}

export enum Status {
  Success = "SUCCESS",
  WrongCode = "WRONG CODE",
  Failure = "FAILURE",
  Pending = "PENDING",
  Redirect = "REDIRECT",
}

export enum FormValid {
  Valid = "VALID",
  Invalid = "INVALID",
  PasswordsDoNotMatch = "PASSWORDS DO NOT MATCH",
  WeakPassword = "WEAK PASSWORD",
  FirstNameLengthOutOfBounds = "FIRST NAME LENGTH OUT OF BOUNDS",
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
