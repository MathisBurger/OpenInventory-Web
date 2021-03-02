import { Component, OnInit } from '@angular/core';
import {CookieHandler} from "../../../classes/cookie-handler";
import {Constants} from "../../../classes/constants";
import {LoginHandler} from "../../../classes/login-handler";

@Component({
  selector: 'app-new-table',
  templateUrl: './new-table.component.html',
  styleUrls: ['./new-table.component.css']
})
export class NewTableComponent implements OnInit {

  constructor() { }
  column_length = [];
  show_column_selection = false;
  perm_lvls = [];

  ngOnInit(): void {
    new LoginHandler().checkCreds().then();
    for (let i=1; i<=100; i++) {
      this.perm_lvls[(i-1)] = i;
    }
  }

  onColumnNumSubmit(): void {
    let val = (document.getElementById('new-table-colum-lengh-input') as HTMLInputElement).valueAsNumber;
    if (val == 0 || val == Number.NaN || val < 0 || !Number.isInteger(val) || val == Number.EPSILON || val > 100) {
      alert('You have to input an value greater than 0 and smaller than 100 as integer')
    } else {
      for (let i=0; i<val; i++){
        this.column_length[i] = (i as number);
      }
      this.show_column_selection = true;
    }
  }

  createTable(): void {
    var alert = document.getElementById('new-table-alert');
    alert.classList.remove('alert', 'alert-danger', 'alert-success');
    alert.innerHTML = '';
    let name = (document.getElementById('newtable-name') as HTMLInputElement).value;
    let minpermlvl: number = +(document.getElementById('min-perm-lvl-select') as HTMLSelectElement).value;
    let tuples = [];
    let field_names = (document.getElementsByClassName('newtable-field-name') as HTMLCollectionOf<HTMLInputElement>);
    let field_types = (document.getElementsByClassName('newtable-field-type') as HTMLCollectionOf<HTMLSelectElement>);
    for (let i=0; i<field_names.length; i++) {
      tuples[tuples.length] = '(' + field_types[i].value + ';' +  field_names[i].value + ')';
    }
    let origin = new Constants().API_Origin;
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
        row_config: tuples.toString(),
        min_perm_lvl: minpermlvl
      })
    }).then(res => res.json())
      .then(data => {
        var alert = document.getElementById('new-table-alert');
        if (data.message === 'successful') {
          alert.classList.add('alert', 'alert-success');
          alert.innerHTML = 'Successfully created table.';
          (document.getElementById('newtable-name') as HTMLInputElement).value = '';
          let names = (document.getElementsByClassName('newtable-field-name') as HTMLCollectionOf<HTMLInputElement>)
          for (let i=0; i<names.length; i++) {
            names[i].value = '';
          }
          setTimeout(() => {
            var alert = document.getElementById('new-table-alert');
            alert.classList.remove('alert', 'alert-danger', 'alert-success');
            alert.innerHTML = '';
          }, 1000);
        } else {
          alert.classList.add('alert', 'alert-danger');
          alert.innerHTML = data.message;
        }
      })
  }

}
