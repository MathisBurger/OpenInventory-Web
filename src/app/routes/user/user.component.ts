import {Component, Inject, Injector, OnInit} from '@angular/core';
import {Md5} from "ts-md5";
import {RestAPIService} from "../../services/rest-api.service";
import {PopupWindowService} from "../../components/popup-window/popup-window.service";
import {UserModel} from "../../models/user-model";
import {Utils} from "../../../classes/utils";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: UserModel[];
  selected_user = '';
  permGroups = [];
  outstanding_perm_groups = [];

  constructor(
    @Inject('RestAPIService') private api: RestAPIService,
    injector: Injector,
    public popup: PopupWindowService
  ) { }

  ngOnInit(): void {

    // check login status
    this.api.getAccessToken().subscribe(data => {
      if (data == 'unauthorized') { location.href = '/login'; }
      else { this.api.sessionToken = data.token; }

      this.api.getAllUser()
        .subscribe(data => {
          this.user = data.user;
        });
    });
  }

  parseDate(date: string): string {
    return new Date(date).toLocaleDateString("de-DE");
  }

  // selects user
  selectUser(username: any): void {
    this.selected_user = username;
  }

  // loads permission of user
  loadPermissions(username: string): void {

    // select user
    this.selectUser(username);

    this.api.listAllPermsOfUser(username)
      .subscribe(data => {
        if (data.message == 'Successfully fetched all user permissions') {
            this.permGroups = data.permissions;
        } else {
         this.popup.showAsComponent(data.message, data.alert);
         this.popup.closePopup(1000);
        }
      })

    // gets all permission groups
    this.api.getAllPermissionGroups()
      .subscribe(data => {
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
          this.popup.showAsComponent(data.message, data.alert);
          this.popup.closePopup(1000);
        }
      });
  }

  // adds permission to user
  addPermissionToUser(perm: string): void {

    this.api.addUserToPermissionGroup(perm, this.selected_user).then(res => res.subscribe(data => {
      if (data.message == 'User added to permissiongroup') {
        this.loadPermissions(this.selected_user);
      } else {
        this.popup.showAsComponent(data.message, data.alert);
        this.popup.closePopup(1000);
      }
    }));
  }

  // remove permission from user
  removePermissionFromUser(perm: string): void {

    this.api.removeUserFromPermissionGroup(this.selected_user, perm).then(res => res.subscribe(data => {
      if (data.message == 'Successfully removed permission from user') {
        this.loadPermissions(this.selected_user);
      } else {
        this.popup.showAsComponent(data.message, data.alert);
        this.popup.closePopup(1000);
      }
    }));
  }


  // checks if array includes value
  arr_includes(arr: any, val: string): boolean {
    for (let i=0; i<arr.length; i++) {
      if (arr[i].name == val) {
        return true;
      }
    }
    return false;
  }

  // adds user to system
  addUser(username: string, pwd: string, retype_pwd: string, mail: string, root: boolean, status: boolean): void {

    let validation = new Utils().validatePassword(pwd);

    if (!validation[0]) {
      this.popup.showAsComponent(validation[1], '#d41717');
      this.popup.closePopup(1500);
      return;
    }

    pwd = Md5.hashStr(pwd).toString();
    retype_pwd = Md5.hashStr(retype_pwd).toString();

    let final_status = '';
    if (status) {
      final_status = 'enabled';
    } else {
      final_status = 'disabled';
    }
    if (pwd == retype_pwd) {

      this.api.addUser(username, pwd, root, mail, final_status).then(res => res.subscribe(data => {
        if (data.message == 'Successfully added user') {
          location.reload();
        } else {
          this.popup.showAsComponent(data.message, data.alert);
          this.popup.closePopup(1000);
        }
      }));
    } else {
      this.popup.showAsComponent('passwords are not matching', '#d41717');
      this.popup.closePopup(1000);
    }
  }

  // deletes user from system
  deleteUser(name: string): void {

    this.api.deleteUser(name).then(res => res.subscribe(data => {
      if (data.message == 'Successfully deleted user') {
        location.reload();
      } else {
        this.popup.showAsComponent(data.message, data.alert);
        this.popup.closePopup(1000);
      }
    }));
  }

}
