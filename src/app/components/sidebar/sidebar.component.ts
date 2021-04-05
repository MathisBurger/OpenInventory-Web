import { Inject, Injector } from '@angular/core';
import {Component, Input, OnInit} from '@angular/core';
import { RestAPIService } from 'src/app/services/rest-api.service';
import {CookieHandler} from "../../../classes/cookie-handler";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(
    @Inject('RestAPIService') private api: RestAPIService,
    injector: Injector
  ) { }

  @Input() active: string;

  ngOnInit(): void {

    // sets active value
    let element = document.querySelector('#link-' + this.active) as HTMLAnchorElement;
    element.classList.add('active');
  }


  logout(): void {

    this.api.revokeSession().subscribe(data => {
        location.href = '/login';
    });
  }

}
