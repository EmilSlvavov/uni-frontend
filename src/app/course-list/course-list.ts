import { Component, inject } from '@angular/core';
import { CourseService } from '../course.service';

@Component({
  imports: [],
  selector: 'app-course-list',
  styleUrl: './course-list.css',
  templateUrl: './course-list.html',
})
export class CourseList {
  private readonly courseService = inject(CourseService);

  protected readonly courses = this.courseService.courses;

  protected renameFirst(): void {
    this.courseService.rename(1, 'Advanced Databases');
  }

  protected renameBad(): void {
    this.courseService.renameBadly(1, "Bad Name")
  }

  protected getCourses(): void {
    this.courseService.loadCourse()
  }
}
