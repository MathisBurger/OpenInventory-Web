import { Component, OnInit } from '@angular/core';
import {Var} from '../../../classes/var';
import {CookieHandler} from '../../../classes/cookie-handler';
import {split} from 'ts-node';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  tables = [];
  constructor() { }

  ngOnInit(): void {
    let var1 = new Var();
    let loginCreds = new CookieHandler().getLoginCreds();
    console.log('got login creds');
    fetch(var1.API_Origin + '/table_management/get_all_tables', {
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
        let raw_table_data = data.message
          .split('[').join('')
          .split(']').join('')
          .split('\'').join('')
          .split(';');
        for (let i=0; i<(raw_table_data.length - 1); i++) {
          this.tables[this.tables.length] = raw_table_data[i];
        }
      });
  }

  getSingleVals(val: string, index: number): string {
    let arr = val.split(',');
    switch (index){
      case 0:
        return arr[0].split('table_').join('');
      case 1:
        return arr[1];
      case 2:
        let date = arr[2].split(' ')[0]
        return date;
    }

  }

}
