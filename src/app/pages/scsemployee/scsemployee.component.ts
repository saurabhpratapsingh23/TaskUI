import { Component, OnInit } from "@angular/core";
import { Http, Response, Headers, ResponseContentType } from "@angular/http";
import { Router, NavigationExtras } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";

import "rxjs/add/operator/map";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: "app-scsemployee",
  templateUrl: "./scsemployee.component.html",
  styleUrls: ["./scsemployee.component.css"],
})
export class SCSEmployeeComponent implements OnInit {
  managerMap: Map<number, any> = new Map<number, any>();
  departmentMap: Map<number, any> = new Map<number, any>();
  designationMap: Map<number, any> = new Map<number, any>();
  managerId: string;
  managers: any[] = [];
  managerList: any[] = [];
  departments: any[] = [];
  designations: any[] = [];
  records: any[] = [];
  isLoading: boolean = false;
  router: Router;
  deleteId: string;
  totalEmployees: string;
  uploadForm: FormGroup;

  total = 0;
  page = 1;
  limit = 10;
  goToPage(n: number): void {
    this.page = n;
    this.loadIntialListOfEmplyees();
  }

  onNext(): void {
    this.page++;
    this.loadIntialListOfEmplyees();
  }

  onPrev(): void {
    this.page--;
    this.loadIntialListOfEmplyees();
  }
  private loadAllManager() {
    this.isLoading = true;
    this._http
      .get("http://localhost:8181/Transafe/getAllManagerInfos")
      .map((res: Response) => res.json())
      .subscribe(
        (data) => {
          this.managers = data;
          for (let manager of this.managers) {
            this.managerMap.set(manager.id, manager.firstName);
          }
        },
        (err) => {}
      );
    this.isLoading = false;
  }

  private loadAllDepartment() {
    this.isLoading = true;
    this._http
      .get("http://localhost:8181/taskmaster/getAllSCSDepartments")
      .map((res: Response) => res.json())
      .subscribe(
        (data) => {
          this.departments = data;
          for (let department of this.departments) {
            this.departmentMap.set(
              department.departmentId,
              department.departmentName
            );
          }
        },
        (err) => {
          //console.log('Something went wrong!');
        }
      );
    this.isLoading = false;
  }

  private loadAllDesignation() {
    this.isLoading = true;
    this._http
      .get("http://localhost:8181/taskmaster/getAllSCSDesignations")
      .map((res: Response) => res.json())
      .subscribe(
        (data) => {
          this.designations = data;
          for (let designation of this.designations) {
            this.designationMap.set(
              designation.designationId,
              designation.designationName
            );
          }
        },
        (err) => {}
      );
    this.isLoading = false;
  }

  constructor(_router: Router, private _http: Http) {
    this.router = _router;
    this.loadIntialListOfEmplyees();
    this.loadAllDepartment();
    this.loadAllManager();
    this.loadAllDesignation();
  }

  private loadIntialListOfEmplyees() {
    this.isLoading = true;
    return this._http
      .get("http://localhost:8181/taskmaster/listallusersfromdb")
      .map((res: Response) => res.json())
      .subscribe(
        (data) => {
          this.records = data.content;
          this.total = data.totalRecords;
          console.log(this.records);
          this.isLoading = false;
        },
        (err) => {
          console.log("Something went wrong!");
          this.isLoading = false;
        }
      );
  }

  public edit(id: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: { session_id: id },
      skipLocationChange: true,
    };
    this.router.navigate(["/scsemployee/scsemployeedetails"], navigationExtras);
  }

  public selectForDelete(id: string) {
    this.deleteId = id;
  }

  public delete() {
    this.isLoading = true;
    return this._http
      .delete(
        "http://localhost:8181/taskmaster/deleteSCSEmployee/" + this.deleteId
      )
      .subscribe(
        (data) => {
          var $toastContent = $(
            "<span>Record has been deleted successfully!!</span>"
          );
          Materialize.toast($toastContent, 2000);
          this.isLoading = false;
          this.loadIntialListOfEmplyees();
        },
        (err) => {
          console.log("Something went wrong!");
          this.isLoading = false;
        }
      );
  }

  public moveNext(event, tab) {
    $(".collapsible").collapsible("open", tab);
  }

  ngOnInit() {
    $("select").material_select();
    $(".collapsible").collapsible();
    $(".modal").modal();
  }

  ngAfterViewChecked() {
    let self = this;
  }
}
