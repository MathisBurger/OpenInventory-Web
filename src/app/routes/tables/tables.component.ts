import { Component, OnInit } from '@angular/core';
import {LoginHandler} from "../../../classes/login-handler";
import {CookieHandler} from "../../../classes/cookie-handler";
import {Constants} from "../../../classes/constants";
import {Utils} from "../../../classes/utils";

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {
  tables = [];
  perm_lvls = [];
  permGroups = [];
  min_perm_lvl: string;
  active_table: string;
  constructor() { }

  ngOnInit(): void {
    new LoginHandler().checkCreds().then();
    for (let i=1; i<=100; i++) {
      this.perm_lvls[(i-1)] = i;
    }
    new LoginHandler().checkCreds().then();
    let var1 = new Constants();
    let loginCreds = new CookieHandler().getLoginCreds();
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
      case 3:
        return arr[3];
    }
  }

  openTable(name: string): void {
    new CookieHandler().setCookie('active-table', name, 1);
    location.href = '/view-table';
  }

  deleteTable(name: string): void {
    let loginCreds = new CookieHandler().getLoginCreds();
    fetch(new Constants().API_Origin + '/table-management/DeleteTable', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'applicaton/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: loginCreds[0],
        password: loginCreds[1],
        token: loginCreds[2],
        table_name: name
      })
    }).then(res => res.json())
      .then(data => {
          if (data.message == 'Successfully deleted table') {
            location.reload();
          } else {
            let alert = document.querySelector('#tables-alert-dialog') as HTMLDivElement;
            let split = data.alert.split(' ');
            alert.innerText = data.message;
            alert.classList.add(split[0], split[1]);
            setTimeout(() => {
              alert.classList.remove(split[0], split[1]);
              alert.innerText = '';
            }, 1000);
          }
      })
  }

  loadPermissions(tablename: string, min_perm_lvl: string): void {
    let creds = new CookieHandler().getLoginCreds();
      fetch(new Constants().API_Origin + '/permission-management/ListAllPermGroupsOfTable', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
          username: creds[0],
          password: creds[1],
          token: creds[2],
          table_name: tablename
        })
      }).then(res => res.json())
        .then(data => {
          this.permGroups = new Utils().bubblesort_perm_array(data.perm_groups).reverse();
          this.min_perm_lvl = min_perm_lvl;
          let element = document.querySelector('#table-perm-min-select') as HTMLSelectElement;
          element.selectedIndex = +min_perm_lvl - 1;
          this.active_table = tablename;
        });
  }

  updateMinPermlvl(): void {
    let creds = new CookieHandler().getLoginCreds();
    let newlvl: number = +(document.querySelector('#table-perm-min-select') as HTMLSelectElement).value;
    fetch(new Constants().API_Origin + '/permission-management/editTableMinPermLvl', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        username: creds[0],
        password: creds[1],
        token: creds[2],
        table_name: this.active_table,
        new_lvl: newlvl
      })
    }).then(res => res.json())
      .then(data => {
        let alert = document.querySelector('#table-perm-modal-alert-dialog') as HTMLDivElement;
        let split = data.alert.split(' ');
        alert.innerHTML = data.message;
        alert.classList.add(split[0], split[1]);
        setTimeout(() => {
          alert.innerHTML = '';
          alert.classList.remove(split[0], split[1]);
        }, 1000);
      })
  }


  onMinPermLvlChange(): void {
    let element = document.querySelector('#table-update-btn') as HTMLButtonElement;
    element.classList.remove('disabled');
    element.disabled = false;
  }

}
