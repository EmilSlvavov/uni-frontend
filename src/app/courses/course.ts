export interface UserSummary {
  id: number;
  name: string;
}
export interface CourseBase {
  id: number;
  name: string;
  departmentId: number;
  departmentName: string;
  lecturerId?: number;
  lecturerName?: string;
  users: UserSummary[];
}
export interface OnsiteCourse extends CourseBase {
  type: 'ONSITE';
  roomNumber: number;
}
export interface OnlineCourse extends CourseBase {
  type: 'ONLINE';
  meetingUrl: string;
}
export type Course = OnsiteCourse | OnlineCourse;


export interface CourseCreateRequest {
  type: CourseType | '';
  name: string;
  departmentId: string;
  roomNumber: string;
  meetingUrl: string;
}

export type CourseType = 'ONLINE' | 'ONSITE';

export interface CourseUpdateRequest {
  name: string;
}

export interface SoftDeletedCourse {
  id: number;
  name: string;
  departmentId: number;
  departmentName: string;
  lecturerId?: number;
  lecturerName?: string;
  type: CourseType;
  meetingUrl?: string;
  roomNumber?: number;
  isDeleted: boolean;
}
