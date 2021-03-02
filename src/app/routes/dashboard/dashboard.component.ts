import {Component, Inject, Injector, OnInit} from '@angular/core';
import {RestAPIService} from "../../services/rest-api.service";
import {PopupWindowService} from "../../components/popup-window/popup-window.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    @Inject('RestAPIService') private api: RestAPIService,
    injector: Injector,
    public popup: PopupWindowService
    ) { }

  ngOnInit(): void {

    // check status of login credentials
    this.api.checkCreds().subscribe(data => {
      if (data.message != 'Login successful') { location.href = '/login'; }
    });


  }

}
