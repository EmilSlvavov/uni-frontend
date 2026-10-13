import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseSoftDeletedList } from './course-soft-deleted-list';

describe('CourseSoftDeletedList', () => {
  let component: CourseSoftDeletedList;
  let fixture: ComponentFixture<CourseSoftDeletedList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseSoftDeletedList],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseSoftDeletedList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
