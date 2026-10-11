import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentSoftDeletedList } from './department-soft-deleted-list';

describe('DepartmentSoftDeletedList', () => {
  let component: DepartmentSoftDeletedList;
  let fixture: ComponentFixture<DepartmentSoftDeletedList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentSoftDeletedList],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentSoftDeletedList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
