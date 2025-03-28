import {
  Component,
  OnInit,
  AfterViewChecked,
  ViewChildren,
  AfterViewInit,
} from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { NgModel, FormControl } from "@angular/forms";
import "rxjs/add/operator/map";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: "app-scsemployeedetails",
  templateUrl: "./scsemployeedetails.component.html",
  styleUrls: ["./scsemployeedetails.component.css"],
})
export class SCSEmployeedetailsComponent implements OnInit, AfterViewChecked {
  isLoading: boolean = false;

  isApproved: string;
  isActive: string;
  empId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  emailId: string;
  phoneNumber: string;
  roleId: string;
  editId: string;

  router: Router;
  RAGAMusicProfileCode: string;
  @ViewChildren("allTheseThings") things;

  constructor(
    _router: Router,
    private _http: Http,
    private route: ActivatedRoute
  ) {
    this.router = _router;
  }

  private createReminder() {
    this.isLoading = true;

    this.gender = $("#gender").val();

    if (this.editId && this.editId !== "" && this.editId !== "None") {
      var data = {
        empId: this.empId,
        firstName: this.firstName,
        middleName: this.middleName,
        lastName: this.lastName,
        gender: this.gender,

        branchId: 1,

        emailId: this.emailId,
        phoneNumber: this.phoneNumber,

        otpGen: 1234,
        otpConfirm: 1234,
        isActive: "y",
        isApproved: "y",
      };

      data["empId"] = this.editId;
      return this._http
        .put("http://52.66.59.165:8080/taskmaster/updateSCSEmployee/", data)
        .subscribe(
          (res) => {
            console.log(res);
            this.isLoading = false;
            var $toastContent = $(
              "<span>Record has been saved successfully!!</span>"
            );
            Materialize.toast($toastContent, 2000);
            this.router.navigate(["/scsemployee"]);
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
      var data1 = {
        empId: this.empId,
        firstName: this.firstName,
        middleName: this.middleName,
        lastName: this.lastName,
        gender: this.gender,
        photo: "test.jpg",
        emailId: this.emailId,
        phoneNumber: this.phoneNumber,

        otpGen: 1234,
        otpConfirm: 1234,
        isActive: "y",
        isApproved: "y",
      };
      return this._http
        .post("http://52.66.59.165:8080/taskmaster/register/", data1)
        .subscribe(
          (res) => {
            console.log(res);
            this.isLoading = false;
            var $toastContent = $(
              "<span>Record has been saved successfully!!</span>"
            );
            Materialize.toast($toastContent, 2000);
            this.router.navigate(["/scsemployee"]);
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

  public moveNext(event, tab) {
    $(".collapsible").collapsible("open", tab);
  }
  ngAfterViewInit() {
    this.things.changes.subscribe((t) => {
      $("select").material_select();
    });
    $("#dob").pickadate({
      selectMonths: true,
      selectYears: 100,
      closeOnSelect: true,
    });
  }

  ngAfterViewChecked() {
    Materialize.updateTextFields();
  }
  ngOnInit() {
    $("select").material_select();
    $(".collapsible").collapsible({
      onOpen: function (el) {
        Materialize.updateTextFields();
      },
    });

    this.route.queryParamMap
      .map((params) => params.get("session_id") || "None")
      .subscribe((val) => (this.editId = val));

    console.log(this.editId);

    if (this.editId && this.editId !== "" && this.editId !== "None") {
      this.isLoading = true;
      return this._http
        .get(
          "http://52.66.59.165:8080/taskmaster/getSCSEmployeeById/" +
            this.editId
        )
        .map((res: Response) => res.json())
        .subscribe(
          (data) => {
            var record = data[0];

            this.empId = record["empId"];
            this.firstName = record["firstName"];
            this.middleName = record["middleName"];
            this.lastName = record["lastName"];
            this.gender = record["gender"];

            this.emailId = record["emailId"];

            this.phoneNumber = record["phoneNumber"];

            $("#gender").val(this.gender);
            this.isLoading = false;

            $("select").material_select();

            Materialize.updateTextFields();
            //debugger;
          },
          (err) => {
            console.log("Something went wrong!");
            this.isLoading = false;
          }
        );
    }
    //   let m = this.model;
    //   m.valueChanges.subscribe(value => {
    //     Materialize.updateTextFields();
    // });
    Materialize.updateTextFields();
  }
}
