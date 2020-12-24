import { Component, OnInit } from '@angular/core';
import {Var} from '../../../classes/var';
import {CookieHandler} from '../../../classes/cookie-handler';
import {createComponent} from '@angular/compiler/src/core';

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
    fetch(var1.API_Origin + '/table-management/getAllTables', {
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

  openTable(name: string): void {
    console.log(name);

  }

}
