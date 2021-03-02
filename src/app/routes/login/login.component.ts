import {Component, Inject, Injector, OnInit} from '@angular/core';
import {LoginHandler} from "../../../classes/login-handler";
import {Md5} from 'ts-md5/dist/md5';
import {RestAPIService} from "../../services/rest-api.service";
import {PopupWindowService} from "../../components/popup-window/popup-window.service";
import {CookieHandler} from "../../../classes/cookie-handler";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    @Inject('RestAPIService') private api: RestAPIService,
    injector: Injector,
    public popup: PopupWindowService
  ) { }

  // no init actions
  ngOnInit(): void {}

  // on login button click
  login(): void {

    // getting parameter from
    let username = (document.getElementById('username') as HTMLInputElement).value;
    let password = Md5.hashStr((document.getElementById('password') as HTMLInputElement).value).toString();
    let stayLoggedIn = (document.getElementById('remember-me') as HTMLInputElement).checked;

    // defined cookie expiration
    let ext = 1;
    if (stayLoggedIn) {
      ext = 7;
    }

    // call API
    this.api.login(username, password).subscribe(data => {
      // login successful
      if (data.alert == 'alert alert-success') {
        new CookieHandler().setLoginCreds(username, password, data.token, ext);
        location.href = '/dashboard';
      } else {
        this.popup.showAsComponent(data.message, '#d41717');
        this.popup.closePopup(1000);
      }
    });
  }

}
