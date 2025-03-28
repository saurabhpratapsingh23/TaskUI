import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Http, Response, Headers } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { NgModel, FormControl } from "@angular/forms";
import "rxjs/add/operator/map";

declare var $: any;
declare var Materialize: any;

@Injectable()
export class AuthService {
  private event = new BehaviorSubject<number>(0);
  loginEvent$ = this.event.asObservable();

  constructor(private _http: Http) {}

  login(username: string, password: string) {
    if (username === "johndoe" && password === "admin") {
      localStorage.setItem("currentUser", username);
      localStorage.setItem("role", "0");
      this.event.next(1);
      return true;
    } else {
      var $toastContent = $(
        '<span class=""><i class="material-icons left red-text">error</i>Invalid Username / Password</span>'
      );
      Materialize.toast($toastContent, 3000);
    }
    return false;
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    this.event.next(0);
  }

  isAuthenicated() {
    let currentUser = localStorage.getItem("currentUser");
    if (currentUser && currentUser !== "") {
      return true;
    }
    return false;
  }
}
