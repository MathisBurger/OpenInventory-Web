import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {LoginHandler} from '../../classes/login-handler';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  active = 'new-table';
  constructor() { }

  ngOnInit(): void {
    this.fullHeight();
    new LoginHandler().status().then(res => {
      if (!res) {
        location.href = '/login';
      }
    });
  }

  onNavClick(param: string): void {
    document.querySelector('#active-' + this.active).classList.remove('active');
    document.querySelector('#active-' + param).classList.add('active');
    this.active = param;
  }

  onToggleClick(): void {
    $('#sidebar').toggleClass('active');
  }

  fullHeight(): void {
    $('.js-fullheight').css('height', $(window).height());
    $(window).resize(function(){
      $('.js-fullheight').css('height', $(window).height());
    });
  }



}
