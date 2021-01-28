import {Component, Input, OnInit} from '@angular/core';
import {CookieHandler} from "../../../classes/cookie-handler";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor() { }
  @Input() active: string;
  ngOnInit(): void {
    let element = document.querySelector('#link-' + this.active) as HTMLAnchorElement;
    element.classList.add('active');
  }

  logout(): void {
    new CookieHandler().setLoginCreds('', '', '', 1);
    location.href = '/login';
  }

}
