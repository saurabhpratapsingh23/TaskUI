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
import { Owner, Property } from "../../../../utils/types";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: "app-tenantsdetails",
  templateUrl: "./tenantsdetails.component.html",
  styleUrls: ["./tenantsdetails.component.css"],
})
export class TenantsdetailsComponent implements OnInit, AfterViewChecked {
  isLoading: boolean = false;
  owner: Owner = {
    ownerId: 0,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    registrationDate: new Date(),
  };
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
        this.loadOwnerDetails();
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

  loadOwnerDetails() {
    if (this.editId && this.editId !== "" && this.editId !== "None") {
      this.isLoading = true;
      this._http
        .get<Owner>("http://localhost:8181/rentalhubapi/owner/" + this.editId)
        .map((res: Owner) => {
          console.log(res);
          return res;
        })
        .subscribe(
          (data: Owner) => {
            this.owner = data;
            this.owner.registrationDate = new Date(this.owner.registrationDate);
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

  saveOwner() {
    this.isLoading = true;
    if (this.editId && this.editId !== "" && this.editId !== "None") {
      return this._http
        .put("http://localhost:8181/rentalhubapi/updateOwner", this.owner)
        .subscribe(
          (res) => {
            console.log(res);
            this.isLoading = false;
            var $toastContent = $(
              "<span>Record has been saved successfully!!</span>"
            );
            Materialize.toast($toastContent, 2000);
            this.router.navigate(["/owners"]);
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
        .post("http://localhost:8181/rentalhubapi/createOwner", this.owner)
        .subscribe(
          (res) => {
            console.log(res);
            this.isLoading = false;
            var $toastContent = $(
              "<span>Record has been saved successfully!!</span>"
            );
            Materialize.toast($toastContent, 2000);
            this.router.navigate(["/owners"]);
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
