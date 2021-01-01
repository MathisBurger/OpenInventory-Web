import {Component, OnInit} from '@angular/core';
import {CookieHandler} from '../../classes/cookie-handler';
import {Var} from '../../classes/var';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  table_name = '';
  columns = [];
  rows = [];
  empty = 'true';
  constructor() { }

  ngOnInit(): void {
      let creds = new CookieHandler().getLoginCreds();
      this.table_name = new CookieHandler().getCookie('active-table');
      new CookieHandler().setCookie('redirect-table', 'false', 365);
      fetch(new Var().API_Origin + '/table-management/getTableContent', {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify({
          username: creds[0],
          password: creds[1],
          token: creds[2],
          table_name: this.table_name
        })
      }).then(res => res.json())
        .then(data => {
          if (data.message == 'successful') {
              if (data.elements == 'null') {
                return;
              }
              this.empty = 'false';
              let json = JSON.parse(data.elements);
              var columns = [];

              for (var k in json[0]) columns.push(k);
              this.columns = columns;
              var rows = [];
              for (let i=0; i<json.length; i++) {
                var row = [];
                for (let x=0; x<columns.length; x++) {
                  row.push(this.parseRowElement(json[i][columns[x]], columns[x]));
                }
                rows.push(row);
              }
              this.rows = rows;
          } else {
            let alert = (document.getElementById('alert-div') as HTMLDivElement);
            let alert_arr = data.alert.split(' ');
            alert.classList.add(alert_arr[0], alert_arr[1]);
            alert.innerHTML = data.message;
            setTimeout(() => {
              alert.classList.remove(alert_arr[0], alert_arr[1]);
              alert.innerHTML = '';
            }, 1000);

          }
        });
      fetch(new Var().API_Origin + '/table-management/getTableColumns', {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify({
          username: creds[0],
          password: creds[1],
          token: creds[2],
          table_name: this.table_name
        })
      }).then(res => res.json())
        .then(data => {
            if (data.message == 'successful') {
              var render = '<table><tr><td>Name</td><td>Value</td><td>Type</td></tr>';
              for (let i=0; i<data.columns.length; i++) {
                  render += this.calculateHTML(data.columns[i]);
              }
              render += '</table>';
              (document.querySelector('#new-entry-modal') as HTMLDivElement).innerHTML = render;
            }
        });
  }

  calculateHTML(json: any): string {
    if (json.COLUMN_NAME == 'id') {
      return '';
    } else {
      switch (json.DATA_TYPE) {
        case 'int':
          return '<tr><td>' + json.COLUMN_NAME + '</td><td><input type="number" maxlength="65535" step="1" class="form-control input" placeholder="' + json.COLUMN_NAME + '"></td><td>INT</td></tr>';
        case 'float':
          return '<tr><td>' + json.COLUMN_NAME + '</td><td><input type="number" maxlength="65535" class="form-control input" placeholder="' + json.COLUMN_NAME + '"></td><td>FLOAT</td></tr>';
        case 'tinyint':
          return '<tr><td>' + json.COLUMN_NAME + '</td><td><input type="checkbox" class="form-control input" placeholder="' + json.COLUMN_NAME + '"></td><td>BOOLEAN</td></tr>';
        case 'varchar':
          return '<tr><td>' + json.COLUMN_NAME + '</td><td><input type="text" class="form-control input" maxlength="'
            + json.CHARACTER_MAXIMUM_LENGTH + '" placeholder="' + json.COLUMN_NAME + '"></td><td>STRING (' + json.CHARACTER_MAXIMUM_LENGTH + ' Chars)</td></tr>';
      }
    }
  }


  parseRowElement(element: any, name: string): string {
      if (name == 'id') {
        return element;
      }
      var keys = [];
      for (var k in element) keys.push(k);
      if (!keys.includes('Valid')) {
        return atob(element);
      }
      for (let i=0; i<keys.length; i++) {
        if (keys[i] != 'Valid') {
          return element[keys[i]];
        }
      }
  }


  addEntry(): void {
    let inputs = (document.getElementsByClassName('input') as HTMLCollectionOf<HTMLInputElement>);
    let json = JSON.parse('{}');
    for (let i=0; i<inputs.length; i++) {
      if (inputs[i].type == 'checkbox') {
        if (inputs[i].checked) {
          json[inputs[i].placeholder] = '1';
        } else {
          json[inputs[i].placeholder] = '0';
        }
      } else {
        json[inputs[i].placeholder] = inputs[i].value;
      }
    }
    let creds = new CookieHandler().getLoginCreds();
    fetch(new Var().API_Origin + '/table-management/AddTableEntry', {
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify({
        username: creds[0],
        password: creds[1],
        token: creds[2],
        table_name: this.table_name,
        row: json
      })
    }).then(res => res.json())
      .then(data => {
        let alert = (document.getElementById('alert-div') as HTMLDivElement);
        let alert_arr = data.alert.split(' ');
        alert.classList.add(alert_arr[0], alert_arr[1]);
        alert.innerHTML = data.message;
        setTimeout(() => {
          alert.classList.remove(alert_arr[0], alert_arr[1]);
          alert.innerHTML = '';
        }, 1000);
      });
    new CookieHandler().setCookie('redirect-table', 'true', 365)
    location.reload();
  }

  removeEntry(id: number): void {
    console.log('bobobobo')
    let creds = new CookieHandler().getLoginCreds();
    fetch(new Var().API_Origin + '/table-management/RemoveTableEntry', {
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify({
        username: creds[0],
        password: creds[1],
        token: creds[2],
        table_name: this.table_name,
        row_id: id
      })
    }).then(res => res.json())
      .then(data => {
        console.log(data);
        let alert = (document.getElementById('alert-div') as HTMLDivElement);
        let alert_arr = data.alert.split(' ');
        alert.classList.add(alert_arr[0], alert_arr[1]);
        alert.innerHTML = data.message;
        setTimeout(() => {
          alert.classList.remove(alert_arr[0], alert_arr[1]);
          alert.innerHTML = '';
        }, 1000);
      });
    new CookieHandler().setCookie('redirect-table', 'true', 365)
    location.reload();
  }

  deleteTable(): void {
    let creds = new CookieHandler().getLoginCreds();
    fetch(new Var().API_Origin + '/table-management/DeleteTable', {
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify({
        username: creds[0],
        password: creds[1],
        token: creds[2],
        table_name: this.table_name,
      })
    });
    location.reload();
  }

  getIdFromRow(row: any): number {
    let index = 0;
    for (let i=0; i<this.columns.length; i++) {
      if (this.columns[i] == 'id') {
        index = i;
        break;
      }
    }
    return row[index];
  }

}
