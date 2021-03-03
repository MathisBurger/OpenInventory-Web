import {Component, Inject, Injector, OnInit} from '@angular/core';
import {RestAPIService} from "../../services/rest-api.service";
import {PopupWindowService} from "../../components/popup-window/popup-window.service";

@Component({
  selector: 'app-system-info',
  templateUrl: './system-info.component.html',
  styleUrls: ['./system-info.component.css']
})
export class SystemInfoComponent implements OnInit {
  apiLang: string;
  apiVersion: string;
  cpuCores: string;
  operatingSystem: string;

  constructor(
    @Inject('RestAPIService') private api: RestAPIService,
    injector: Injector,
    public popup: PopupWindowService
  ) { }

  ngOnInit(): void {

    // check login status
    this.api.checkCreds().subscribe(data => {
      if (data.message != 'Login successful') { location.href = '/login'; }
    });

    this.api.getSystemInfo()
      .subscribe(data => {
        this.apiLang = data.api_language;
        this.apiVersion = data.api_version;
        this.cpuCores = data.cpu_cores;
        this.operatingSystem = data.operating_system;
      })
  }

}
