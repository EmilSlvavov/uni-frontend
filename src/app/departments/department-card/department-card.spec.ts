import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentCard } from './department-card';
import { Department } from '../department';
import { provideRouter } from '@angular/router';

const department: Department = {
  id: 1,
  name: 'Computer Science',
  contacts: [{ type: 'EMAIL', value: 'cs@uni.test' }],
  courses: [{ id: 10, name: 'Algorithms' }],
};

describe('DepartmentCard', () => {
  let component: DepartmentCard;
  let fixture: ComponentFixture<DepartmentCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentCard);
    component = fixture.componentInstance
    fixture.componentRef.setInput('department', department)
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
