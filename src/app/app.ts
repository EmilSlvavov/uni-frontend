import { Component, signal } from '@angular/core';
import { CourseList} from './course-list/course-list';

@Component({
  imports: [CourseList],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('uni-frontend');
}
