import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentEditName } from './department-edit-name';

describe('DepartmentEditName', () => {
  let component: DepartmentEditName;
  let fixture: ComponentFixture<DepartmentEditName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentEditName],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentEditName);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
