import { Component, input, output } from '@angular/core';
import { Course } from '../course';
import { CourseTypeLabelPipe } from '../../shared/course-type-label-pipe';
import { ExternalLink } from '../../shared/external-link';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CourseTypeLabelPipe, ExternalLink, RouterLink],
  selector: 'app-course-card',
  styleUrl: './course-card.css',
  templateUrl: './course-card.html',
})
export class CourseCard {
  readonly course = input.required<Course>();
  readonly isLinkVisible = input(true);
  readonly canEnroll = input(false);
  readonly enroll = output<number>();

  protected onEnrollClick(): void {
    this.enroll.emit(this.course().id)
  }
}
