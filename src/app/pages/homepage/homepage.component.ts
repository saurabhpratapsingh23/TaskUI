import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers ,ResponseContentType} from '@angular/http';
import {Router,  NavigationExtras} from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import 'rxjs/add/operator/map';

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomePageComponent implements  OnInit {

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

  
  constructor(_router: Router, private _http: Http) {
    this.router = _router;
    this.loadIntialListOfEmplyees();
    // this.countEmployeeRecords();
   }

   private loadIntialListOfEmplyees() {
     this.isLoading = true;
     return this._http.get('http://localhost:8080/CygnustutorAPI/listRewardsPlans?page=' + this.page + '&size=' + this.limit)
    .map((res: Response) => res.json())
      .subscribe(data => {
        this.records = data.rewardsPlanList;
        this.total = data.totalRecords;
        console.log(this.records);
        this.isLoading = false;
    }, 
    err => { 
      console.log('Something went wrong!');
      this.isLoading = false;      
    });
   }

 public edit(id: string) {
  let navigationExtras: NavigationExtras = {
    queryParams: { 'session_id': id },
    skipLocationChange: true
  };   
    this.router.navigate(['/admin/rewardsplan/rewardsplandetails'], navigationExtras);
  }   

  public selectForDelete(id: string) {
      this.deleteId = id;
  }    

  public delete() {
    this.isLoading = true;
    return this._http.delete('http://localhost:8080/CygnustutorAPI/deleteRewardsPlan/' + this.deleteId)    
     .subscribe(data => {            
          var $toastContent = $('<span>Record has been deleted successfully!!</span>');
          Materialize.toast($toastContent, 2000);
            this.isLoading = false;
            this.loadIntialListOfEmplyees();
    }, 
    err => {
      console.log('Something went wrong!');
      this.isLoading = false;      
    });
  }

  public moveNext(event, tab) {
    $('.collapsible').collapsible('open', tab);
  }

  ngOnInit() {
    $("select").material_select();
    $('.collapsible').collapsible(); 
    $('.modal').modal();
  }

  ngAfterViewChecked() {
    let self = this;
    
  }

 

  

 
}



