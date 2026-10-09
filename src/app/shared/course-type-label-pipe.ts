import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'courseTypeLabel',
})
export class CourseTypeLabelPipe implements PipeTransform {
  transform(type: 'ONLINE' | 'ONSITE'): string {
    return type === 'ONLINE' ? 'Online' : 'On-site';
  }
}
