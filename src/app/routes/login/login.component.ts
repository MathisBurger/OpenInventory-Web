import {Component, Inject, Injector, OnInit} from '@angular/core';
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
  login(username: string, password: string, stayLoggedIn: boolean): void {

    // generates MD5 hash of password
    password = Md5.hashStr(password).toString();

    // defined cookie expiration
    let ext = 1;
    if (stayLoggedIn) {
      ext = 7;
    }

    // call API
    this.api.login(username, password).subscribe(data => {

      // login successful
      if (data.message == 'Login successful') {
        new CookieHandler().setLoginCreds(username, password, data.token, ext);
        location.href = '/dashboard';
      } else {
        this.popup.showAsComponent(data.message, data.alert);
        this.popup.closePopup(1000);
      }
    });
  }

}
