import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TenantsdetailsComponent } from "./tenantsdetails.component";

describe("TenantsdetailsComponent", () => {
  let component: TenantsdetailsComponent;
  let fixture: ComponentFixture<TenantsdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TenantsdetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantsdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
