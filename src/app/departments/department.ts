import { CourseSummary } from '../auth/user';

export interface Department {
  id: number
  name: string
  contacts: ContactInfo[]
  courses: CourseSummary[]
}

export interface SoftDeletedDepartment {
  id: number
  name: string
  contacts: ContactInfo[]
  isDeleted: boolean
}

export interface ContactInfo {
  type: ContactType
  value: string
}

export interface ContactInfoRequest {
  contacts: ContactInfo[]
}

export interface DepartmentRequest {
  name: string
}

export type ContactType = 'EMAIL' | 'PHONE' | 'OFFICE';


