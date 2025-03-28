import { Component, OnInit } from "@angular/core";
import { Http, Response, Headers, ResponseContentType } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, NavigationExtras } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";

import "rxjs/add/operator/map";
import {
  ListAppointmentsResponse,
  ListOwnersResponse,
  ListPropertiesResponse,
  ListTenantsResponse,
  Owner,
  Property,
  Tenant,
} from "../../../utils/types";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: "app-appointments",
  templateUrl: "./appointments.component.html",
  styleUrls: ["./appointments.component.css"],
})
export class AppointmentsComponent implements OnInit {
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

  ownerMap: Map<number, Owner> = new Map<number, Owner>();
  propertyMap: Map<number, Property> = new Map<number, Property>();
  tenantMap: Map<number, Tenant> = new Map<number, Tenant>();

  total = 0;
  page = 1;
  limit = 10;
  goToPage(n: number): void {
    this.page = n;
    this.loadAllAppointments();
  }

  onNext(): void {
    this.page++;
    this.loadAllAppointments();
  }

  onPrev(): void {
    this.page--;
    this.loadAllAppointments();
  }

  initializeMaterializeComponents() {
    $("select").material_select();
    $(".collapsible").collapsible({
      onOpen: function (el) {
        Materialize.updateTextFields();
      },
      onclose: function (el) {
        Materialize.updateTextFields();
      },
    });
  }

  // private loadAllAppointments() {
  //   this.isLoading = true;
  //   return this._http
  //     .get("http://localhost:8181/rentalhubapi/listAllAppointments")
  //     .map((res: ListAppointmentsResponse) => res)
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
  loadAllAppointments() {
    this.isLoading = true;
    const params = {
      pageNumber: this.page.toString(),
      size: this.limit.toString(),
    };
    this._http
      .get<ListAppointmentsResponse>(
        "http://localhost:8181/rentalhubapi/listAllAppointments",
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

  loadOwners() {
    this.isLoading = true;
    this._http
      .get<ListOwnersResponse>(
        "http://localhost:8181/rentalhubapi/listAllOwners"
      )
      .subscribe(
        (data) => {
          // this.ownerMap = new Map(
          //   data.content.map((owner) => [owner.ownerId, owner])
          // );
          this.ownerMap = new Map<number, Owner>(
            data.content.map((owner: Owner): [number, Owner] => [
              owner.ownerId,
              owner,
            ])
          );
          console.log(this.ownerMap);
          this.isLoading = false;
          this.initializeMaterializeComponents();
        },
        (err) => {
          console.log("Something went wrong!");
          this.isLoading = false;
        }
      );
  }

  loadProperties() {
    this.isLoading = true;
    this._http
      .get<ListPropertiesResponse>(
        "http://localhost:8181/rentalhubapi/listAllProperties"
      )
      .subscribe(
        (data) => {
          // this.propertyMap = new Map(
          //   data.content.map((property) => [property.propertyId, property])
          // );
          this.propertyMap = new Map<number, Property>(
            data.content.map((property: Property): [number, Property] => [
              property.propertyId,
              property,
            ])
          );
          this.isLoading = false;
          this.initializeMaterializeComponents();
        },
        (err) => {
          console.log("Something went wrong!");
          this.isLoading = false;
        }
      );
  }

  loadTenants() {
    this.isLoading = true;
    this._http
      .get<ListTenantsResponse>(
        "http://localhost:8181/rentalhubapi/listAllUsers"
      )
      .subscribe(
        (data) => {
          // this.tenantMap = new Map(
          //   data.content.map((tenant) => [tenant.userId, tenant])
          // );
          this.tenantMap = new Map<number, Tenant>(
            data.content.map((tenant: Tenant): [number, Tenant] => [
              tenant.userId,
              tenant,
            ])
          );
          this.isLoading = false;
          this.initializeMaterializeComponents();
        },
        (err) => {
          console.log("Something went wrong!");
          this.isLoading = false;
        }
      );
  }

  constructor(_router: Router, private _http: HttpClient) {
    this.router = _router;
    this.loadTenants();
    this.loadOwners();
    this.loadProperties();
    this.loadAllAppointments();
  }

  getOwnerName(id: number) {
    const owner = this.ownerMap.get(id);
    return owner ? `${owner.firstName} ${owner.lastName}` : " ";
  }

  getTenantName(id: number) {
    const tenant = this.tenantMap.get(id);
    return tenant ? `${tenant.firstName} ${tenant.lastName}` : " ";
  }

  // getPropertyTitle(id: number) {
  //   const { title } = this.propertyMap.get(id);
  //   return title;
  // }
  getPropertyTitle(propertyId: number): string {
    const property = this.propertyMap.get(propertyId);
    return property ? property.title : " ";
  }

  public edit(id: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: { session_id: id },
      skipLocationChange: true,
    };
    this.router.navigate(
      ["/appointments/appointmentsdetails"],
      navigationExtras
    );
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
          this.loadAllAppointments();
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
