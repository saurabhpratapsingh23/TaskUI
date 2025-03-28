import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SCSEmployeedetailsComponent } from './scsemployeedetails.component';

describe('SCSEmployeedetailsComponent', () => {
  let component: SCSEmployeedetailsComponent;
  let fixture: ComponentFixture<SCSEmployeedetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SCSEmployeedetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SCSEmployeedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
