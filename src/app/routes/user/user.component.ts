import { Component, OnInit } from '@angular/core';
import {CookieHandler} from "../../../classes/cookie-handler";
import {Constants} from "../../../classes/constants";
import {Md5} from "ts-md5";
import {LoginHandler} from "../../../classes/login-handler";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user = []
  selected_user = '';
  permGroups = [];
  outstanding_perm_groups = [];
  constructor() { }

  ngOnInit(): void {
    new LoginHandler().checkCreds().then();
    let loginCreds = new CookieHandler().getLoginCreds();
    fetch(new Constants().API_Origin + '/user-management/ListUser', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'applicaton/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: loginCreds[0],
        password: loginCreds[1],
        token: loginCreds[2]
      })
    }).then(res => res.json())
      .then(data => {
        this.user = data.user;
      })

  }

  selectUser(username: any): void {
    this.selected_user = username;
  }

  loadPermissions(username: string): void {
    //this.permGroups = [];
    //this.outstanding_perm_groups = [];
    let creds = new CookieHandler().getLoginCreds();
    this.selectUser(username);
    fetch(new Constants().API_Origin + '/permission-management/listAllPermsOfUser', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        username: creds[0],
        password: creds[1],
        token: creds[2],
        user: username
      })
    }).then(res => res.json())
      .then(data => {
        if (data.message == 'Successfully fetched all user permissions') {
            this.permGroups = data.permissions;
        } else {
          let alert = document.querySelector('#user-permissions-modal-alert') as HTMLDivElement;
          let split = data.alert.split(' ');
          alert.classList.add(split[0], split[1]);
          alert.innerHTML = data.message;
          setTimeout(() => {
            alert.innerHTML = '';
            alert.classList.remove(split[0], split[1]);
          }, 100);
        }
      })
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
          let cached_groups = data.permission_groups;
          let unmatching_groups = [];
          for (let i=0; i<cached_groups.length; i++) {
            if (!this.arr_includes(this.permGroups, cached_groups[i].name)) {
              unmatching_groups[unmatching_groups.length] = cached_groups[i];
            }
          }
          this.outstanding_perm_groups = unmatching_groups;
        } else {
          let alert = document.querySelector('#user-permissions-modal-alert') as HTMLDivElement;
          let split = data.alert.split(' ');
          alert.classList.add(split[0], split[1]);
          alert.innerHTML = data.message;
          setTimeout(() => {
            alert.innerHTML = '';
            alert.classList.remove(split[0], split[1]);
          }, 100);
        }
      });
  }

  addPermissionToUser(): void {
    let creds = new CookieHandler().getLoginCreds();
    let perm = (document.querySelector('#user-permission-modal-select') as HTMLSelectElement).value;
    fetch(new Constants().API_Origin + '/permission-management/addUserToPermissionGroup', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        username: creds[0],
        password: creds[1],
        token: creds[2],
        permission: perm,
        user: this.selected_user
      })
    }).then(res => res.json())
      .then(data => {
          if (data.message == 'User added to permissiongroup') {
            this.loadPermissions(this.selected_user);
          } else {
            let alert = document.querySelector('#user-permissions-modal-alert') as HTMLDivElement;
            let split = data.alert.split(' ');
            alert.classList.add(split[0], split[1]);
            alert.innerHTML = data.message;
            setTimeout(() => {
              alert.innerHTML = '';
              alert.classList.remove(split[0], split[1]);
            }, 100);
          }
      });
  }

  removePermissionFromUser(): void {
    let creds = new CookieHandler().getLoginCreds();
    let perm = (document.querySelector('#user-permission-modal-select-remove') as HTMLSelectElement).value;
    fetch(new Constants().API_Origin + '/permission-management/removeUserFromPermissionGroup', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        username: creds[0],
        password: creds[1],
        token: creds[2],
        permission_name: perm,
        user: this.selected_user
      })
    }).then(res => res.json())
      .then(data => {
        if (data.message == 'Successfully removed permission from user') {
          this.loadPermissions(this.selected_user);
        } else {
          let alert = document.querySelector('#user-permissions-modal-alert') as HTMLDivElement;
          let split = data.alert.split(' ');
          alert.classList.add(split[0], split[1]);
          alert.innerHTML = data.message;
          setTimeout(() => {
            alert.innerHTML = '';
            alert.classList.remove(split[0], split[1]);
          }, 100);
        }
      })
  }

  bs64ToUFT8(bs64: any): any {
    return atob(bs64);
  }

  arr_includes(arr: any, val: string): boolean {
    for (let i=0; i<arr.length; i++) {
      if (arr[i].name == val) {
        return true;
      }
    }
    return false;
  }

  addUser(): void {
    let username = (document.getElementById('addUser-username') as HTMLInputElement).value;
    let pwd = Md5.hashStr((document.getElementById('addUser-password') as HTMLInputElement).value).toString();
    let retype_pwd = Md5.hashStr((document.getElementById('addUser-retype-password') as HTMLInputElement).value).toString();
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
      fetch(new Constants().API_Origin + '/user-management/AddUser', {
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
            }, 1000);
          }
        })
    } else {
      let alert = (document.querySelector('#addUser-alert') as HTMLDivElement);
      alert.classList.add('alert', 'alert-warning');
      alert.innerHTML = 'Passwords are not matching';
      setTimeout(() => {
        alert.innerHTML = '';
        alert.classList.remove('alert', 'alert-warning');
      }, 2000);
    }
  }

  deleteUser(name: string): void {
    let creds = new CookieHandler().getLoginCreds();
    fetch(new Constants().API_Origin + '/user-management/DeleteUser', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        username: creds[0],
        password: creds[1],
        token: creds[2],
        user: name
      })
    }).then(res => res.json())
      .then(data => {
        if (data.message == 'Successfully deleted user') {
          location.reload();
        } else {
          let alert = document.querySelector('#settings-alert') as HTMLDivElement;
          let split = data.alert.split(' ');
          alert.classList.add(split[0], split[1]);
          alert.innerHTML = data.message;
          setTimeout(() => {
            alert.innerHTML = '';
            alert.classList.remove(split[0], split[1]);
          }, 100);
        }
      })
  }

}
