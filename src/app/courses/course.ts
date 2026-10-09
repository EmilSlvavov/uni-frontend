export interface UserSummary {
  id: number;
  name: string;
}
export interface CourseBase {
  id: number;
  name: string;
  departmentId: number;
  departmentName: string;
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
