export interface CourseData {
  id?: number;
  course_code: string;
  course_name: string;
  section_name: string;
  semester_id: number;
}
export interface CourseEditData {
  courseCode: string;
  courseName: string;
  semesterId: number;
  inviteCode: string;
}

export interface CourseAdminDetails {
  courseId: number;
  courseCode: string;
  semesterName: string;
  members: number;
  creator: {
    firstName: string;
    lastName: string;
  };
}

export interface StudentUser {
  student_id: number;
  id: number;
}

export interface EmployeeUser {
  employee_id: number;
  id: number;
}

export interface CourseEditData {
  courseCode: string;
  courseName: string;
  semesterId: number;
  inviteCode: string;
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
  student_user: StudentUser | null;
  employee_user: EmployeeUser | null;
}

export interface UpdatedUser {
  first_name?: string;
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
  created_at: number;
  updated_at: number;
  is_archived: boolean;
  invite_code: string;
  section_name: string;
  semester: {
    id: number;
    name: string;
    starts_at: number;
    ends_at: number;
    created_at: number;
    updated_at: number;
  };
}
export interface Exam {
  id: number;
  name: string;
  created_at: number;
  updated_at: number;
  exam_date: number;
  grades_released_at: number;
  exam_folder: string;
}

export interface Submission {
  student_id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
  };
  answers: JSON;
  score: number;
  updated_at: number;
  submission_id: string;
  exam_id: string;
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
    courseCode: string;
    courseName: string;
    examName: string;
    answers: number[][];
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
  Submissions_Disputes = "SUBMISSIONS DISPUTES",
  Edit_Course = "COURSE SETTINGS",
}

export interface SemesterData {
  id?: number;
  name: string;
  starts_at: number;
  ends_at: number;
  course_count?: number;
}

export enum SemesterValid {
  Valid = "VALID",
  Invalid = "INVALID",
  DatesInThePast = "DATES IN THE PAST",
  EndDateBeforeStartDate = "END DATE BEFORE START DATE",
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
    hasStudent?: boolean;
  };
  course: {
    id: number;
    courseName: string;
    courseCode: string;
  };
  grades: number[];
  answers: {
    errorFlag: boolean;
    answer_list: JSON[];
  };
}

export interface AnalyticsExamSubmission {
  student: {
    id: number;
    firstName: string;
    lastName: string;
    submissionScore: number;
    avatarUrl: string;
  };
}

export interface AnalyticsSubmission {
  exam: {
    id: number;
    title: string;
  };
  submissions: AnalyticsExamSubmission[];
}

export interface CourseAnalytics {
  courseMembersSize: number;
  courseExamsCount: number;
  examSubmissionsCount: number;
  examSubmissions: AnalyticsSubmission[];
}

export interface ExamDisputes {
  examId: number;
  examName: string;
  numberOfDisputes: number;
}

export interface ExamSubmissionsDisputes {
  id: number;
  status: string;
  created_at: number;
}

export interface ExamSubmissionDispute {
  created_at: number;
  description: string;
  id: number;
  resolved_at: number | null;
  status: string;
  submission: {
    created_at: number;
    document_path: string;
    id: number;
    score: number;
    student: {
      id: number;
      student_id: number;
      user: {
        first_name: string;
        id: number;
        last_name: string;
      };
    };
    updated_at: number;
  };
  updated_at: number;
}

export interface UserEditData {
  first_name: string;
  last_name: string;
  student_id: number;
  employee_id: number;
}
