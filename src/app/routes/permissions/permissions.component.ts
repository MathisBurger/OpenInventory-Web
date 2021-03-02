import { Component, OnInit } from '@angular/core';
import {Constants} from "../../../classes/constants";
import {CookieHandler} from "../../../classes/cookie-handler";
import {LoginHandler} from "../../../classes/login-handler";

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit {
  permGroups = []
  numArr = []
  constructor() { }

  ngOnInit(): void {
    new LoginHandler().checkCreds().then();
    for (let i=0; i<100; i++) {
      this.numArr[i] = i + 1;
    }
    let creds = new CookieHandler().getLoginCreds();
    fetch(new Constants().API_Origin + '/permission-management/listAllPermissionGroups', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        username: creds[0],
        password: creds[1],
        token: creds[2]
      })
    }).then(res => res.json())
      .then(data => {
        if (data.message == 'Successfully fetched all permission groups') {
          this.permGroups = data.permission_groups;
        } else {
          let alert = document.querySelector('#permission-page-main-alert') as HTMLDivElement;
          alert.classList.add('alert', 'alert-danger');
          alert.innerHTML = data.message;
          setTimeout(() => {
            alert.classList.remove('alert', 'alert-danger');
            alert.innerHTML = '';
          }, 1000);
        }
      });
  }

  HexToRGB(h: string): string {
    let r: string, g: string, b: string;
    if (h.length == 4) {
      r = "0x" + h[1] + h[1];
      g = "0x" + h[2] + h[2];
      b = "0x" + h[3] + h[3];
    } else if (h.length == 7) {
      r = "0x" + h[1] + h[2];
      g = "0x" + h[3] + h[4];
      b = "0x" + h[5] + h[6];
    }

    return ""+ +r + "," + +g + "," + +b;
  }

  addPermissionGroup(): void {
    let creds = new CookieHandler().getLoginCreds();
    let perm_name = (document.querySelector('#new-permission-modal-name-input') as HTMLInputElement).value;
    let perm_lvl = +(document.querySelector('#new-permission-modal-lvl-input') as HTMLSelectElement).value;
    let perm_color = this.HexToRGB((document.querySelector('#new-permission-modal-color-input') as HTMLInputElement).value);
    fetch(new Constants().API_Origin + '/permission-management/createPermissionGroup', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        username: creds[0],
        password: creds[1],
        token: creds[2],
        permission_info: {
          name: perm_name,
          color_code: perm_color,
          permission_level: perm_lvl
        }
      })
    }).then(res => res.json())
      .then(data => {
        if (data.message == 'Created permissiongroup') {
          location.reload();
        } else {
          let alert = document.querySelector('#new-permission-modal-alert') as HTMLDivElement;
          let split = data.alert.split(' ');
          alert.classList.add(split[0], split[1]);
          alert.innerHTML = data.message;
          setTimeout(() => {
            alert.classList.remove(split[0], split[1]);
            alert.innerHTML = '';
          }, 1000);
        }
      })
  }

  deletePermissionGroup(name: string): void {
    let real_name = name.split('.')[1];
    let creds = new CookieHandler().getLoginCreds();
    fetch(new Constants().API_Origin + '/permission-management/deletePermissionGroup', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        username: creds[0],
        password: creds[1],
        token: creds[2],
        group_name: real_name
      })
    }).then(res => res.json())
      .then(data => {
        if (data.message == 'Successfully deleted PermissionGroup') {
          location.reload();
        } else {
          let alert = document.querySelector('#permission-page-main-alert') as HTMLDivElement;
          alert.classList.add('alert', 'alert-danger');
          alert.innerHTML = data.message;
          setTimeout(() => {
            alert.classList.remove('alert', 'alert-danger');
            alert.innerHTML = '';
          }, 1000);
        }
      });
  }

}
