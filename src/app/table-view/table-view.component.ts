import { Component, OnInit } from '@angular/core';
import {CookieHandler} from "../../classes/cookie-handler";
import {Constants} from "../../classes/constants";
import {Utils} from "../../classes/utils";

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent implements OnInit {
  table_name = '';
  columns = [];
  rows = [];
  empty = 'true';
  min_perm_lvl: string;
  length_counter = [];
  edit_row = []
  permGroups = [];

  constructor() { }

  ngOnInit(): void {
    let creds = new CookieHandler().getLoginCreds();
    this.table_name = new CookieHandler().getCookie('active-table');
    (document.querySelector('#table-name-input') as HTMLInputElement).value = this.table_name;
    fetch(new Constants().API_Origin + '/table-management/getTableContent', {
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
    fetch(new Constants().API_Origin + '/table-management/getTableColumns', {
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
          (document.querySelector('#column-name-input') as HTMLInputElement).value = this.columns[0];
        }
      });

  }

  anyToNumber(el: any): number {
    return el as number;
  }

  editTableEntry(): void {
    let creds = new CookieHandler().getLoginCreds();
    let active_table = new CookieHandler().getCookie('active-table');
    let rows = <HTMLCollectionOf<HTMLInputElement>>document.getElementsByClassName('form-control column-identity');
    let map = JSON.parse("{}");
    for (let i=0; i<rows.length; i++) {
      map[rows.item(i).id.split('-')[1]] = rows.item(i).value;
    }
    console.log(map);
    fetch(new Constants().API_Origin + '/table-management/editTableEntry', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        username: creds[0],
        password: creds[1],
        token: creds[2],
        table_name: active_table,
        object_id: this.getIdFromRow(this.edit_row),
        row: map
      })
    }).then(res => res.json())
      .then(data => {
        if (data.message == 'Successfully updated entry') {
          location.reload();
        } else {
          let alert = document.querySelector('#secound-table-view-modal-alert-dialog') as HTMLDivElement;
          let split = data.alert.split(' ');
          alert.innerHTML = data.message;
          alert.classList.add(split[0], split[1]);
          setTimeout(() => {
            alert.innerHTML = '';
            alert.classList.remove(split[0], split[1]);
          }, 1000);
        }
      });
  }

  initalizeEntryEditing(row: any): void {
    for (let i=0; i<this.columns.length; i++) {
      this.length_counter[i] = i;
    }
    this.edit_row = row;

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

  rl(): void {
    location.reload();
  }

  onColumnNameInputChange(): void {
    let element = document.querySelector('#column-name-update-btn') as HTMLButtonElement;
    element.disabled = false;
    element.classList.remove('disabled');
  }

  onTablenameChange(): void {
    let element = document.querySelector('#table-tablename-btn') as HTMLButtonElement;
    element.classList.remove('disabled');
    element.disabled = false;
  }

  updateTableName(): void {
    let creds = new CookieHandler().getLoginCreds();
    let newName = (document.querySelector('#table-name-input') as HTMLInputElement).value;
    let active_table = new CookieHandler().getCookie('active-table');
    fetch(new Constants().API_Origin + '/table-management/renameTable', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        username: creds[0],
        password: creds[1],
        token: creds[2],
        table_name: active_table,
        new_name: newName
      })
    }).then(res => res.json())
      .then(data => {
        if (data.message == 'Successfully updated tablename') {
          new CookieHandler().setCookie('active-table', newName, 1);
          location.reload();
        } else {
          let alert = document.querySelector('#table-view-modal-alert') as HTMLDivElement;
          let split = data.alert.split(' ');
          alert.innerHTML = data.message;
          alert.classList.add(split[0], split[1]);
          setTimeout(() => {
            alert.innerHTML = '';
            alert.classList.remove(split[0], split[1]);
          }, 1000);
        }
      });
  }

  updateColumnName(): void {
    let creds = new CookieHandler().getLoginCreds();
    let active_table = new CookieHandler().getCookie('active-table');
    let oldName = (document.querySelector('#new-columnname-select') as HTMLSelectElement).value;
    let newName = (document.querySelector('#column-name-input') as HTMLInputElement).value;
    fetch(new Constants().API_Origin + '/table-management/renameTableColumn', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        username: creds[0],
        password: creds[1],
        token: creds[2],
        table_name: active_table,
        old_name: oldName,
        new_name: newName
      })
    }).then(res => res.json())
      .then(data => {
        if (data.message == 'Successfully changed column name') {
          location.reload();
        } else {
          let alert = document.querySelector('#table-view-modal-alert') as HTMLDivElement;
          let split = data.alert.split(' ');
          alert.innerHTML = data.message;
          alert.classList.add(split[0], split[1]);
          setTimeout(() => {
            alert.innerHTML = '';
            alert.classList.remove(split[0], split[1]);
          }, 1000);
        }
      })
  }

  onColumnNameSwitch(event: any): void {
    (document.querySelector('#column-name-input') as HTMLInputElement).value = event.target.value;
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
      });
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
    fetch(new Constants().API_Origin + '/table-management/AddTableEntry', {
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
        new CookieHandler().setCookie('redirect-table', 'true', 365)

      });

  }

  removeEntry(id: number): void {
    console.log('bobobobo')
    let creds = new CookieHandler().getLoginCreds();
    fetch(new Constants().API_Origin + '/table-management/RemoveTableEntry', {
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
    fetch(new Constants().API_Origin + '/table-management/DeleteTable', {
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
