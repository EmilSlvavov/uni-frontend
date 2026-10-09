export interface ProblemDetail {
  title: string;
  status: number;
  detail: string;
  traceId?: string;
  errors?: Record<string, string>;
}
