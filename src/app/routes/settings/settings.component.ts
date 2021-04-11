import {Component, Inject, Injector, OnInit} from '@angular/core';
import {Constants} from "../../../classes/constants";
import {RestAPIService} from "../../services/rest-api.service";
import {PopupWindowService} from "../../components/popup-window/popup-window.service";
import {DomSanitizer} from '@angular/platform-browser';

declare  var $: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(
    @Inject('RestAPIService') private api: RestAPIService,
    injector: Injector,
    public popup: PopupWindowService,
    private sanitizer: DomSanitizer
  ) { }

  qrurl: any;

  ngOnInit(): void {

    // check for accessToken
    this.api.getAccessToken().subscribe(data => {
      if (data == 'unauthorized') {
        location.href = '/login';
      } else {
        this.api.sessionToken = data.token;
      }
    });
  }

  // This function enables 2fa auth if
  // button is pressed
  enable2FA(): void {
    fetch(new Constants().API_Origin + '/user-management/Enable2FA', {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        Authorization: 'accessToken ' + this.api.sessionToken
      }
    }).then(res => {
      if (res.status == 200) {
        return res.blob();
      } else {
        this.popup.showAsComponent('Auth error', '#d41717');
        this.popup.closePopup(1500);
      }
    }).then(data => {
      if (data == null) {
        return;
      }
      let blob = new Blob([data], {type: data.type});
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(blob);
      this.qrurl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
      $('#qr-modal').modal({
        show: true,
        focus: true
      });
    })
  }

}
