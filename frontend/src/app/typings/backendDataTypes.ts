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
    name: string;
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

export interface Semester {
  id: number;
  name: string;
}

export interface ExamData {
  exam_name: string;
  exam_date: number;
  payload?: JSON;
}

export interface StudentExamResult {
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
}

export enum SelectedButton {
  Create_Exam = "CREATE EXAM",
  People = "PEOPLE",
  Analytics = "ANALYTICS",
  None = "NONE",
}
