import { Component, OnInit } from '@angular/core';
//import * as $ from 'jquery';
import {LoginHandler} from '../../classes/login-handler';
import {CookieHandler} from '../../classes/cookie-handler';
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  active = 'settings';
  constructor() { }

  ngOnInit(): void {
    this.fullHeight();
    new LoginHandler().status().then(res => {
      if (!res) {
        location.href = '/login';
      }
    });
    this.checkRedirectTable();
  }
  onToggleClick(): void {
    $('#sidebar').toggleClass('active');
  }
  onNavClick(param: string): void {
    document.querySelector('#active-' + this.active).classList.remove('active');
    document.querySelector('#active-' + param).classList.add('active');
    this.active = param;
  }
  fullHeight(): void {
    $('.js-fullheight').css('height', $(window).height());
    $(window).resize(function(){
      $('.js-fullheight').css('height', $(window).height());
    });
  }

  checkRedirectTable(): void {
    let inst = new CookieHandler().getCookie('redirect-table');
    if (inst == 'true') {
      document.querySelector('#active-' + this.active).classList.remove('active');
      document.querySelector('#active-' + 'table-all').classList.add('active');
      this.active = 'table-all';
    }
  }



}
