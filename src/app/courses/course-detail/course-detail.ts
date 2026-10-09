import { Component, computed, inject, input, numberAttribute, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Course } from '../course';
import { RouterLink } from '@angular/router';
import { CourseCard } from '../course-card/course-card';
import { CourseService } from '../course.service';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  imports: [RouterLink, CourseCard],
  selector: 'app-course-detail',
  styleUrl: './course-detail.css',
  templateUrl: './course-detail.html',
})
export class CourseDetail {
  readonly id = input.required({ transform: numberAttribute });
  private readonly courseService = inject(CourseService);
  private readonly auth = inject(AuthService);

  readonly courseById = httpResource<Course>(() => {
    return `${environment.apiUrl}/courses/${this.id()}`;
  });

  protected readonly canEnroll = computed(() => {
    const user = this.auth.currentUser();
    if (user?.role !== 'STUDENT' || !this.courseById.hasValue()) {
      return false;
    }
    return !this.courseById.value().users.some((u) => u.id === user.id);
  });

  protected readonly enrollError = signal<string | null>(null);

  protected async onEnroll(courseId: number): Promise<void> {
    const user = this.auth.currentUser();
    if (!user) {
      return;
    }
    this.enrollError.set(null);
    try {
      await this.courseService.enroll(user.id, courseId);
      this.courseById.reload();
    } catch {
      this.enrollError.set('Could not enrol in this course. Please try again.');
    }
  }
}
