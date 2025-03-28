import {
  Component,
  OnInit,
  AfterViewChecked,
  ViewChildren,
  AfterViewInit,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { NgModel, FormControl } from "@angular/forms";
import "rxjs/add/operator/map";
import {
  Appointment,
  ListOwnersResponse,
  ListPropertiesResponse,
  ListTenantsResponse,
  Owner,
  Property,
  Tenant,
} from "../../../../utils/types";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: "app-appointmentsdetails",
  templateUrl: "./appointmentsdetails.component.html",
  styleUrls: ["./appointmentsdetails.component.css"],
})
export class AppointmentsdetailsComponent implements OnInit, AfterViewChecked {
  isLoading: boolean = false;
  appointment: Appointment = {
    appointmentId: 0,
    userId: 0,
    ownerId: 0,
    propertyId: 0,
    appointmentDate: new Date(),
    appointmentTime: new Date(),
    appointmentStatus: "",
    reasonForVisit: "",
    createdAt: new Date(),
  };
  ownerList: Owner[];
  propertyList: Property[];
  tenantList: Tenant[];
  // ownerMap = new Map<string, Owner>();
  editId: string;

  @ViewChildren("allTheseThings") things;

  constructor(
    private router: Router,
    private _http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initializeMaterializeComponents();
    this.route.queryParamMap
      .map((params) => params.get("session_id") || "None")
      .subscribe((val) => {
        this.editId = val;
        this.loadTenants();
        this.loadOwners();
        this.loadProperties();
        this.loadAppointmentDetails();
      });

    Materialize.updateTextFields();
  }

  ngAfterViewInit() {
    this.things.changes.subscribe((t) => {
      this.initializeMaterializeComponents();
    });
  }

  ngAfterViewChecked() {
    Materialize.updateTextFields();
  }

  // formatTime(date: Date): string {
  //   const hours = date.getHours().toString().padStart(2, "0");
  //   const minutes = date.getMinutes().toString().padStart(2, "0");
  //   return `${hours}:${minutes}`;
  // }

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

  loadAppointmentDetails() {
    if (this.editId && this.editId !== "" && this.editId !== "None") {
      this.isLoading = true;
      this._http
        .get<Appointment>(
          "http://localhost:8181/rentalhubapi/appointment/" + this.editId
        )
        .map((res: Appointment) => {
          console.log(res);
          return res;
        })
        .subscribe(
          (data: Appointment) => {
            this.appointment = data;
            this.appointment.createdAt = new Date(this.appointment.createdAt);
            console.log(data);

            this.isLoading = false;
            this.initializeMaterializeComponents();
          },
          (err) => {
            console.log("Something went wrong!", err);
            this.isLoading = false;
          }
        );
    }
  }

  loadOwners() {
    this.isLoading = true;
    this._http
      .get<ListOwnersResponse>(
        "http://localhost:8181/rentalhubapi/listAllOwners"
      )
      .subscribe(
        (data) => {
          this.ownerList = data.content;
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
          this.propertyList = data.content;
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
          this.tenantList = data.content;
          this.isLoading = false;
          this.initializeMaterializeComponents();
        },
        (err) => {
          console.log("Something went wrong!");
          this.isLoading = false;
        }
      );
  }

  saveAppointment() {
    this.isLoading = true;
    if (this.editId && this.editId !== "" && this.editId !== "None") {
      return this._http
        .put(
          "http://localhost:8181/rentalhubapi/updateAppointment",
          this.appointment
        )
        .subscribe(
          (res) => {
            console.log(res);
            this.isLoading = false;
            var $toastContent = $(
              "<span>Record has been saved successfully!!</span>"
            );
            Materialize.toast($toastContent, 2000);
            this.router.navigate(["/appointments"]);
          },
          (err) => {
            var $toastContent = $(
              "<span>" + JSON.parse(err["_body"])[0]["errMessage"] + "</span>"
            );
            Materialize.toast($toastContent, 2000);
            this.isLoading = false;
          }
        );
    } else {
      return this._http
        .post(
          "http://localhost:8181/rentalhubapi/createAppointment",
          this.appointment
        )
        .subscribe(
          (res) => {
            console.log(res);
            this.isLoading = false;
            var $toastContent = $(
              "<span>Record has been saved successfully!!</span>"
            );
            Materialize.toast($toastContent, 2000);
            this.router.navigate(["/appointments"]);
          },
          (err) => {
            var $toastContent = $(
              "<span>" + JSON.parse(err["_body"])[0]["errMessage"] + "</span>"
            );
            Materialize.toast($toastContent, 2000);
            this.isLoading = false;
          }
        );
    }
  }
}
