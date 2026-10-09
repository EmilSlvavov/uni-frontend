export interface CourseSummary {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  bio?: string;
  dateOfBirth?: string;
  courses: CourseSummary[];
}


export interface RegisterModel {
  name: string;
  email: string;
  password: string;
}

export interface LoginModel {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
}

export interface Me {
  id: number;
  name: string;
  email: string;
  role: 'STUDENT' | 'PROFESSOR' | 'ADMIN';
}
