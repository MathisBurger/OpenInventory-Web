import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {LoginHandler} from '../../classes/login-handler';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.fullHeight();
    let loginHandler = new LoginHandler();
    loginHandler.status().then(res => {
      console.log(res);
    })
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
