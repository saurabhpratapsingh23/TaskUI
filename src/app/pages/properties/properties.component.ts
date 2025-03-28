import { Component, OnInit } from "@angular/core";
import { Http, Response, Headers, ResponseContentType } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, NavigationExtras } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";

import "rxjs/add/operator/map";
import { ListPropertiesResponse } from "../../../utils/types";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: "app-properties",
  templateUrl: "./properties.component.html",
  styleUrls: ["./properties.component.css"],
})
export class PropertiesComponent implements OnInit {
  records: any[] = [];
  isLoading: boolean = false;
  router: Router;
  deleteId: string;

  total = 0;
  page = 1;
  limit = 10;
  goToPage(n: number): void {
    this.page = n;
    this.loadAllProperties();
  }

  onNext(): void {
    this.page++;
    this.loadAllProperties();
  }

  onPrev(): void {
    this.page--;
    this.loadAllProperties();
  }

  // private loadAllProperties() {
  //   this.isLoading = true;
  //   return this._http
  //     .get("http://localhost:8181/rentalhubapi/listAllProperties")
  //     .map((res: ListPropertiesResponse) => res)
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
  loadAllProperties() {
    this.isLoading = true;
    const params = {
      pageNumber: this.page.toString(),
      size: this.limit.toString(),
    };
    this._http
      .get<ListPropertiesResponse>(
        "http://localhost:8181/rentalhubapi/listAllProperties",
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
    this.loadAllProperties();
  }

  public edit(id: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: { session_id: id },
      skipLocationChange: true,
    };
    this.router.navigate(["/properties/propertiesdetails"], navigationExtras);
  }

  public selectForDelete(id: string) {
    this.deleteId = id;
  }

  public delete(id: string) {
    this.isLoading = true;
    return this._http
      .request("DELETE", "http://localhost:8181/rentalhubapi/deleteProperty", {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
        }),
        body: {
          propertyId: id,
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
          this.loadAllProperties();
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
