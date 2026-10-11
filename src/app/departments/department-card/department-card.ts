import { Component, input } from '@angular/core';
import { Department } from '../department';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-department-card',
  styleUrl: './department-card.css',
  templateUrl: './department-card.html',
})
export class DepartmentCard {
  readonly department = input.required<Department>();
  readonly isLinkVisible = input(true);
}
