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
