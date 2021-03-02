import { Component, OnInit } from '@angular/core';
import {LoginHandler} from "../../../classes/login-handler";
import {Md5} from 'ts-md5/dist/md5';

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
    let username = (document.getElementById('username') as HTMLInputElement).value;
    let password = Md5.hashStr((document.getElementById('password') as HTMLInputElement).value).toString();
    let stayLoggedIn = (document.getElementById('remember-me') as HTMLInputElement).checked;
    let ext = 1;
    if (stayLoggedIn) {
      ext = 7;
    }
    new LoginHandler().Login(username, password, ext).then();
  }

}
