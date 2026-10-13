import { Component, inject, signal } from '@angular/core';
import { CourseService } from '../course.service';
import { httpResource } from '@angular/common/http';
import { SoftDeletedCourse } from '../course';
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-course-soft-deleted-list',
  styleUrl: './course-soft-deleted-list.css',
  templateUrl: './course-soft-deleted-list.html',
})
export class CourseSoftDeletedList {
  private readonly courseService = inject(CourseService);

  protected readonly softDeletedResource = httpResource<SoftDeletedCourse[]>(() => {
    return `${environment.apiUrl}/courses/softDeleted?deleted=true`;
  });

  protected readonly restoreError = signal<string | null>(null);

  protected async onRestore(id: number): Promise<void> {
    this.restoreError.set(null);
    try {
      await this.courseService.restoreSoftDelete(id);
      this.softDeletedResource.reload();
    } catch {
      this.restoreError.set('Could not restore this course. Please try again.');
    }
  }
}
