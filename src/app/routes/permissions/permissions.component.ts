import {Component, Inject, Injector, OnInit} from '@angular/core';
import {RestAPIService} from "../../services/rest-api.service";
import {PopupWindowService} from "../../components/popup-window/popup-window.service";

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit {
  permGroups = []
  numArr = []

  constructor(
    @Inject('RestAPIService') private api: RestAPIService,
    injector: Injector,
    public popup: PopupWindowService
  ) { }

  // on load
  ngOnInit(): void {

    // check login status
    this.api.getAccessToken().subscribe(data => {
      if (data == 'unauthorized') { location.href = '/login'; }
      else { this.api.sessionToken = data.token; }

      // preparing number array
      for (let i=0; i<100; i++) {
        this.numArr[i] = i + 1;
      }

      // call API
      this.api.getAllPermissionGroups()
        .subscribe(data => {
          if (data.message == 'Successfully fetched all permission groups') {
            this.permGroups = data.permission_groups;
          } else {
            this.popup.showAsComponent(data.message, data.alert);
            this.popup.closePopup(1500);
          }
        });
    });
  }

  // parses hex to rgb color codes
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

  // on click function for adding a permission group
  addPermissionGroup(perm_name: string, perm_lvl: string, perm_color: string): void {

    perm_color = this.HexToRGB(perm_color);
    perm_name = 'permission.' + perm_name;

    // call API
    this.api.createPermissionGroup(perm_name, perm_color, +perm_lvl).then(res => res.subscribe(data => {
      if (data.message == 'Created permission-group') {
        location.reload();
      } else {
        this.popup.showAsComponent(data.message, data.alert);
        this.popup.closePopup(1000);
      }
    }));
  }

  // deletes permission group on button click
  deletePermissionGroup(name: string): void {

    // get permission name
    let real_name = name.split('.')[1];

    // call API
    this.api.deletePermissionGroup(real_name).then(res => res.subscribe(data => {
      if (data.message == 'Successfully deleted PermissionGroup') {
        location.reload();
      } else {
        this.popup.showAsComponent(data.message, data.alert);
        this.popup.closePopup(1500);
      }
    }));
  }

}
