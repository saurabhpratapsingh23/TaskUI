import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { OwnersdetailsComponent } from "./ownersdetails.component";

describe("OwnersdetailsComponent", () => {
  let component: OwnersdetailsComponent;
  let fixture: ComponentFixture<OwnersdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OwnersdetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnersdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
