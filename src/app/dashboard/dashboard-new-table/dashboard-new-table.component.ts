import { Component, OnInit } from '@angular/core';
import {Var} from '../../../classes/var';
import {CookieHandler} from '../../../classes/cookie-handler';

@Component({
  selector: 'app-dashboard-new-table',
  templateUrl: './dashboard-new-table.component.html',
  styleUrls: ['./dashboard-new-table.component.css']
})
export class DashboardNewTableComponent implements OnInit {

  column_length = [];
  show_column_selection = false;
  constructor() { }

  ngOnInit(): void {
  }

  onColumnNumSubmit(): void {
    let val = (document.getElementById('new-table-colum-lengh-input') as HTMLInputElement).valueAsNumber;
    if (val == 0 || val == Number.NaN || val < 0 || !Number.isInteger(val)) {
      alert('You have to input an value greater than 0 as integer')
    } else {
      for (let i=0; i<val; i++){
        this.column_length[i] = (i as number);
      }
      this.show_column_selection = true;
    }
  }

  createTable(): void {
    let name = (document.getElementById('newtable-name') as HTMLInputElement).value;
    let tuples = [];
    let field_names = (document.getElementsByClassName('newtable-field-name') as HTMLCollectionOf<HTMLInputElement>);
    let field_types = (document.getElementsByClassName('newtable-field-type') as HTMLCollectionOf<HTMLSelectElement>);
    for (let i=0; i<field_names.length; i++) {
      tuples[tuples.length] = '(' + field_types[i].value + ';' +  field_names[i].value + ')';
    }
    let origin = new Var().API_Origin;
    let creds = new CookieHandler().getLoginCreds();
    fetch(origin + '/table-management/createTable', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'applicaton/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: creds[0],
        password: creds[1],
        token: creds[2],
        table_name: name,
        row_config: tuples.toString()
      })
    }).then(res => res.json())
      .then(data => {
        console.log(data);
      })
  }

}
