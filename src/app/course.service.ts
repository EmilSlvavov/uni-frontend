import { computed, inject, Injectable, signal } from '@angular/core';
import { Course } from './course';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CourseService {

  private readonly  http = inject(HttpClient)
  private readonly baseUrl = "http://localhost:8080/api"

  private readonly coursesSignal = signal<Course[]>([]);
  readonly courses = this.coursesSignal.asReadonly();

  loadCourse(): void {
    this.http.get<Course[]>(`${this.baseUrl}/courses`).subscribe({
      next: (courses) => this.coursesSignal.set(courses),
      error: (err) => console.error("Failed to load courses", err)
    })
  }

  getAll(): Course[] {
    return this.courses();
  }

  findById(id: number): Course | undefined {
    return this.courses().find((c) => c.id === id);
  }

  readonly onsiteRooms = computed(() =>
    this.coursesSignal()
      .filter((c) => c.type === 'ONSITE')
      .map((c) => c.roomNumber),
  );

  rename(id: number, newName: string): void {
    this.coursesSignal.update((list) =>
      list.map((c) => (c.id === id ? { ...c, name: newName } : c)),
    );
  }

  renameBadly(id: number, newName: string): void {
    const course = this.coursesSignal().find((c) => c.id === id);
    if (course) {
      course.name = newName;
    }
  }
}
