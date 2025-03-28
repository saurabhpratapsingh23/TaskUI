import { Component, OnInit } from "@angular/core";
import { Http, Response, Headers, ResponseContentType } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, NavigationExtras } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";

import "rxjs/add/operator/map";
import { ListTenantsResponse, Owner, Tenant } from "../../../utils/types";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: "app-tenants",
  templateUrl: "./tenants.component.html",
  styleUrls: ["./tenants.component.css"],
})
export class TenantsComponent implements OnInit {
  records: Tenant[] = [];
  isLoading: boolean = false;
  router: Router;
  deleteId: string;

  total = 0;
  page = 1;
  limit = 10;
  goToPage(n: number): void {
    this.page = n;
    this.loadAllTenants();
  }

  onNext(): void {
    this.page++;
    this.loadAllTenants();
  }

  onPrev(): void {
    this.page--;
    this.loadAllTenants();
  }

  // private loadAllTenants() {
  //   this.isLoading = true;
  //   return this._http
  //     .get("http://localhost:8181/rentalhubapi/listAlltenants")
  //     .map((res: ListtenantsResponse) => res)
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

  loadAllTenants() {
    this.isLoading = true;
    const params = {
      pageNumber: this.page.toString(),
      size: this.limit.toString(),
    };
    this._http
      .get<ListTenantsResponse>(
        "http://localhost:8181/rentalhubapi/listAllUsers",
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
    this.loadAllTenants();
  }

  public edit(id: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: { session_id: id },
      skipLocationChange: true,
    };
    this.router.navigate(["/tenants/tenantsdetails"], navigationExtras);
  }

  public selectForDelete(id: string) {
    this.deleteId = id;
  }

  public delete(id: string) {
    this.isLoading = true;
    return this._http
      .request("DELETE", "http://localhost:8181/rentalhubapi/deleteUser", {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
        }),
        body: {
          userId: id,
        },
        responseType: "text",
      })
      .subscribe(
        (data) => {
          var $toastContent = $(
            "<span>Record has been deleted successfully!!</span>"
          );
          Materialize.toast($toastContent, 2000);
          this.isLoading = false;
          this.loadAllTenants();
        },
        (err) => {
          console.error("Error deleting tenant", err);
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
