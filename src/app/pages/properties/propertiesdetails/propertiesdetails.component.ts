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
import { ListOwnersResponse, Owner, Property } from "../../../../utils/types";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: "app-propertiesdetails",
  templateUrl: "./propertiesdetails.component.html",
  styleUrls: ["./propertiesdetails.component.css"],
})
export class PropertiesdetailsComponent implements OnInit, AfterViewChecked {
  isLoading: boolean = false;
  property: Property = {
    propertyId: 0,
    ownerId: 0,
    title: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    pricePerNight: 0,
    maxGuests: 0,
    propertyType: "",
    createdAt: new Date(),
  };
  ownerList: Owner[];
  editId: string;

  @ViewChildren("allTheseThings") things;

  constructor(
    private router: Router,
    private _http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    $("select").material_select();
    $(".collapsible").collapsible({
      onOpen: function (el) {
        Materialize.updateTextFields();
      },
      onclose: function (el) {
        Materialize.updateTextFields();
      },
    });

    this.route.queryParamMap
      .map((params) => params.get("session_id") || "None")
      .subscribe((val) => {
        this.editId = val;
        this.loadOwners();
        this.loadPropertyDetails();
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
        console.log("on open: ", el);
        Materialize.updateTextFields();
      },
      onClose: function (el) {
        console.log("on close: ", el);
        Materialize.updateTextFields();
      },
    });
  }

  // loadOwners() {
  //   // if (this.editId && this.editId !== "" && this.editId !== "None") {
  //   this.isLoading = true;
  //   this._http
  //     .get<ListOwnersResponse>(
  //       "http://localhost:8181/rentalhubapi/listAllOwners"
  //     )
  //     .map((res: ListOwnersResponse) => res)
  //     .subscribe(
  //       (data) => {
  //         this.ownerList = data.content;
  //         console.log(data);
  //         console.log(this.ownerList);

  //         // $("#propertyType").val(this.property.propertyType);
  //         this.isLoading = false;

  //         $("select").material_select();
  //         Materialize.updateTextFields();
  //       },
  //       (err) => {
  //         console.log("Something went wrong!");
  //         this.isLoading = false;
  //       }
  //     );
  //   // }
  //   Materialize.updateTextFields();
  // }

  loadOwners() {
    this.isLoading = true;
    this._http
      .get<ListOwnersResponse>(
        "http://localhost:8181/rentalhubapi/listAllOwners"
      )
      .subscribe(
        (data) => {
          this.ownerList = data.content;
          console.log(this.ownerList);
          this.isLoading = false;
          this.initializeMaterializeComponents();
        },
        (err) => {
          console.log("Something went wrong!");
          this.isLoading = false;
        }
      );
  }

  loadPropertyDetails() {
    if (this.editId && this.editId !== "" && this.editId !== "None") {
      this.isLoading = true;
      return this._http
        .get("http://localhost:8181/rentalhubapi/property/" + this.editId)
        .map((res: Property) => res)
        .subscribe(
          (data) => {
            var record = data;

            this.property.propertyId = record.propertyId;
            this.property.ownerId = record.ownerId;
            this.property.title = record.title;
            this.property.description = record.description;
            this.property.address = record.address;
            this.property.city = record.city;
            this.property.state = record.state;
            this.property.country = record.country;
            this.property.postalCode = record.postalCode;
            this.property.pricePerNight = record.pricePerNight;
            this.property.maxGuests = record.maxGuests;
            this.property.propertyType = record.propertyType;
            this.property.createdAt = new Date(record.createdAt);

            $("#propertyType").val(this.property.propertyType);
            this.isLoading = false;

            $("select").material_select();
            Materialize.updateTextFields();
          },
          (err) => {
            console.log("Something went wrong!");
            this.isLoading = false;
          }
        );
    }
    Materialize.updateTextFields();
  }

  saveProperty() {
    this.isLoading = true;
    if (this.editId && this.editId !== "" && this.editId !== "None") {
      return this._http
        .put("http://localhost:8181/rentalhubapi/updateProperty", this.property)
        .subscribe(
          (res) => {
            console.log(res);
            this.isLoading = false;
            var $toastContent = $(
              "<span>Record has been saved successfully!!</span>"
            );
            Materialize.toast($toastContent, 2000);
            this.router.navigate(["/properties"]);
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
          "http://localhost:8181/rentalhubapi/createProperty",
          this.property
        )
        .subscribe(
          (res) => {
            console.log(res);
            this.isLoading = false;
            var $toastContent = $(
              "<span>Record has been saved successfully!!</span>"
            );
            Materialize.toast($toastContent, 2000);
            this.router.navigate(["/properties"]);
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
