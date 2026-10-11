import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DepartmentDetail } from './department-detail';

describe('DepartmentDetail', () => {
  let component: DepartmentDetail;
  let fixture: ComponentFixture<DepartmentDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentDetail],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
