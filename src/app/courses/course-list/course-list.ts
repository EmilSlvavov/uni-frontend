import { Component, inject} from '@angular/core';
import { CourseService } from '../course.service';
import { CourseCard } from '../course-card/course-card';

@Component({
  imports: [CourseCard],
  selector: 'app-course-list',
  styleUrl: './course-list.css',
  templateUrl: './course-list.html',
})
export class CourseList {
  private readonly courseService = inject(CourseService);
  protected readonly resource = this.courseService.coursesResource;

  protected reloadResources(): void {
    this.resource.reload();
  }
}
