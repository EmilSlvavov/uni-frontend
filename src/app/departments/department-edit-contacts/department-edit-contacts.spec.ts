import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentEditContacts } from './department-edit-contacts';

describe('DepartmentEditContacts', () => {
  let component: DepartmentEditContacts;
  let fixture: ComponentFixture<DepartmentEditContacts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentEditContacts],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentEditContacts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
