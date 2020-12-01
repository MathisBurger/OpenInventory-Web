import { Component, OnInit } from '@angular/core';
import {LoginHandler} from '../../classes/login-handler';
import {CookieHandler} from '../../classes/cookie-handler';
import {tokenize} from '@angular/compiler/src/ml_parser/lexer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  login(): void {
    let username = (<HTMLInputElement>document.getElementById('username')).value;
    let password = (<HTMLInputElement>document.getElementById('password')).value;
    let stayLoggedIn = (<HTMLInputElement>document.getElementById('remember-me')).checked;
    let ext = 1;
    if (stayLoggedIn) {
      ext = 7;
    }
    new LoginHandler().login(username, password, ext).then(res => {
      if (res){
        location.href = '/dashboard';
      } else {
        alert('Die Logindaten sind falsch');
      }
    });

  }

}
