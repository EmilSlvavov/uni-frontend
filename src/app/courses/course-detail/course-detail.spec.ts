import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CourseDetail } from './course-detail';

describe('CourseDetail', () => {
  let component: CourseDetail;
  let fixture: ComponentFixture<CourseDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDetail],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseDetail);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 1);
    TestBed.tick();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne((req) => req.url.endsWith('/courses')).flush([]);
    http.expectOne((req) => req.url.endsWith('/courses/1')).flush({
      id: 1, name: 'Databases', departmentId: 10, departmentName: 'CS',
      type: 'ONSITE', roomNumber: 101, users: [],
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
