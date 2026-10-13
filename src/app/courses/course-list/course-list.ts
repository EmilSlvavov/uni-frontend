import { Component, inject} from '@angular/core';
import { CourseService } from '../course.service';
import { CourseCard } from '../course-card/course-card';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  imports: [CourseCard, RouterLink],
  selector: 'app-course-list',
  styleUrl: './course-list.css',
  templateUrl: './course-list.html',
})
export class CourseList {
  private readonly courseService = inject(CourseService);
  protected readonly resource = this.courseService.coursesResource;
  protected readonly auth = inject(AuthService)

  protected reloadResources(): void {
    this.resource.reload();
  }
}
