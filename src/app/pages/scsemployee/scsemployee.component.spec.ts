import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {SCSEmployeeComponent } from './scsemployeedetails.component';

describe('SCSEmployeeComponent', () => {
  let component:SCSEmployeeComponent;
  let fixture: ComponentFixture<SCSEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SCSEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SCSEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
