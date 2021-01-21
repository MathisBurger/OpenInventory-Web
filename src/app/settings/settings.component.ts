import { Component, OnInit } from '@angular/core';
import {Fetcher} from './fetcher';
import {Var} from '../../classes/var';
import {CookieHandler} from '../../classes/cookie-handler';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  user = []
  selected_user = '';
  constructor() { }

  ngOnInit(): void {
    new Fetcher().getAllUser().then(res => {
      this.user = res;
    });
  }

  addUser(): void {
    let username = (document.getElementById('addUser-username') as HTMLInputElement).value;
    let pwd = (document.getElementById('addUser-password') as HTMLInputElement).value;
    let retype_pwd = (document.getElementById('addUser-retype-password') as HTMLInputElement).value;
    let mail = (document.getElementById('addUser-mail') as HTMLInputElement).value;
    let root = (document.getElementById('addUser-root') as HTMLInputElement).checked;
    let status = (document.getElementById('addUser-status') as HTMLInputElement).checked;
    let loginCreds = new CookieHandler().getLoginCreds();
    let final_status = '';
    if (status) {
      final_status = 'enabled';
    } else {
      final_status = 'disabled';
    }
    if (pwd == retype_pwd) {
      fetch(new Var().API_Origin + '/table-management/AddUser', {
        method: 'POST',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: loginCreds[0],
          password: loginCreds[1],
          token: loginCreds[2],
          user: {
            username: username,
            password: pwd,
            root: root,
            mail: mail,
            status: final_status
          }
        })
      }).then(res => res.json())
        .then(data => {
          if (data.message == 'Successfully added user') {
              location.reload();
          } else {
            let alert = (document.querySelector('#addUser-alert') as HTMLDivElement);
            let class_list = data.alert.split(' ');
            alert.innerHTML = data.message;
            alert.classList.add(class_list[0], class_list[1]);
            setTimeout(() => {
              alert.innerHTML = '';
              alert.classList.remove(class_list[0], class_list[1]);
            }, 2000);
          }
        })
    }
  }

  deleteUser(): void {
    let loginCreds = new CookieHandler().getLoginCreds();
    fetch(new Var().API_Origin + '/table-management/DeleteUser', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: loginCreds[0],
        password: loginCreds[1],
        token: loginCreds[2],
        user: this.selected_user
      })
    });
    location.reload();
  }

  selectUser(username: any): void {
    this.selected_user = username;
  }

  bs64ToUFT8(bs64: any): any {
    return atob(bs64);
  }

}
