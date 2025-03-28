import { Component, OnInit } from "@angular/core";
import { Http, Response, Headers, ResponseContentType } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, NavigationExtras } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";

import "rxjs/add/operator/map";
import { ListOwnersResponse, Owner } from "../../../utils/types";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: "app-owners",
  templateUrl: "./owners.component.html",
  styleUrls: ["./owners.component.css"],
})
export class OwnersComponent implements OnInit {
  managerMap: Map<number, any> = new Map<number, any>();
  departmentMap: Map<number, any> = new Map<number, any>();
  designationMap: Map<number, any> = new Map<number, any>();
  managerId: string;
  managers: any[] = [];
  managerList: any[] = [];
  departments: any[] = [];
  designations: any[] = [];
  records: Owner[] = [];
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
    this.loadAllOwners();
  }

  onNext(): void {
    this.page++;
    this.loadAllOwners();
  }

  onPrev(): void {
    this.page--;
    this.loadAllOwners();
  }

  // private loadAllOwners() {
  //   this.isLoading = true;
  //   return this._http
  //     .get("http://localhost:8181/rentalhubapi/listAllOwners")
  //     .map((res: ListOwnersResponse) => res)
  //     .subscribe(
  //       (data) => {
  //         this.records = data.content;
  //         this.total = data.totalElements;
  //         console.log(this.records);
  //         this.isLoading = false;
  //       },
  //       (err) => {
  //         console.log("Something went wrong!");
  //         this.isLoading = false;
  //       }
  //     );
  // }

  loadAllOwners() {
    this.isLoading = true;
    const params = {
      pageNumber: this.page.toString(),
      size: this.limit.toString(),
    };
    this._http
      .get<ListOwnersResponse>(
        "http://localhost:8181/rentalhubapi/listAllOwners",
        { params }
      )
      .subscribe(
        (data) => {
          this.records = data.content;
          console.log(this.records);
          console.log(data.content);
          this.total = data.totalElements;
          this.isLoading = false;
        },
        (err) => {
          console.error("Something went wrong!", err);
          this.isLoading = false;
        }
      );
  }

  constructor(_router: Router, private _http: HttpClient) {
    this.router = _router;
    this.loadAllOwners();
  }

  public edit(id: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: { session_id: id },
      skipLocationChange: true,
    };
    this.router.navigate(["/owners/ownersdetails"], navigationExtras);
  }

  public selectForDelete(id: string) {
    this.deleteId = id;
  }

  public delete(id: string) {
    this.isLoading = true;
    console.log("PID", this.deleteId);
    return this._http
      .request("DELETE", "http://localhost:8181/rentalhubapi/deleteProperty", {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
        }),
        body: {
          propertyId: id,
        },
      })
      .subscribe(
        (data) => {
          var $toastContent = $(
            "<span>Record has been deleted successfully!!</span>"
          );
          Materialize.toast($toastContent, 2000);
          this.isLoading = false;
          this.loadAllOwners();
        },
        (err) => {
          console.error("Error deleting property", err);
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
