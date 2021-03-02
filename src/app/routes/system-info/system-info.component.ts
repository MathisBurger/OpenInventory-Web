import { Component, OnInit } from '@angular/core';
import {Constants} from "../../../classes/constants";
import {LoginHandler} from "../../../classes/login-handler";

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

  constructor() { }

  ngOnInit(): void {
    new LoginHandler().checkCreds().then();
    fetch(new Constants().API_Origin + '/info', {
      method: 'GET',
      mode: 'cors'
    }).then(res => res.json())
      .then(data => {
        this.apiLang = data['api-language'];
        this.apiVersion = data['api-version'];
        this.cpuCores = data['cpu-cores'];
        this.operatingSystem = data['operating-system'];
      })
  }

}
