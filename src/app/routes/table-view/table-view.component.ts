import {Component, Inject, Injector, OnInit} from '@angular/core';
import {CookieHandler} from "../../../classes/cookie-handler";
import {Constants} from "../../../classes/constants";
import {Utils} from "../../../classes/utils";
import {ColumnsRenderer} from "./columns-renderer";
import {RestAPIService} from "../../services/rest-api.service";
import {PopupWindowService} from "../../components/popup-window/popup-window.service";
import {RowParser} from "./row-parser";

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent implements OnInit {
  table_name = '';
  columns = [];
  rows = [];
  cached_rows = [];
  empty = 'true';
  min_perm_lvl: string;
  length_counter = [];
  edit_row = []
  permGroups = [];

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

    // get name of active table
    this.table_name = new CookieHandler().getCookie('active-table');

    // query content
    this.api.getTableColumns(this.table_name).subscribe(data => {

      this.columns = data.columns;

      // getting content after columns
      this.api.getTableContent(this.table_name)
        .subscribe(data => {

          if (data.message == 'successful') {

            // check if table entries are existing
            if (data.elements == 'null') {
              return;
            }
            // table contains entries
            this.empty = 'false';

            // parse elements to json
            let json = JSON.parse(data.elements);

            // parse json to array of rows
            let rows = new RowParser().parse(json, this.columns);
            console.log(rows);

            this.rows = rows;
            this.cached_rows = rows;
          } else {

            this.popup.showAsComponent(data.message, data.alert);
            this.popup.closePopup(1500);
          }
        });
    });


    // prepare columns for new entry modal
    this.api.getTableColumns(this.table_name)
      .subscribe(data => {
        if (data.message == 'successful') {
          (document.querySelector('#new-entry-modal') as HTMLDivElement).innerHTML = new ColumnsRenderer().render(data);
          (document.querySelector('#column-name-input') as HTMLInputElement).value = this.columns[0].COLUMN_NAME;
        }
      });
  }

  // parses any to number
  anyToNumber(el: any): number {
    return el as number;
  }

  // only displays table entries matching the input
  onSearchType(event: any): void {
    let searchvalue = event.target.value;

    this.rows = [];
    for (let i=0; i<this.cached_rows.length; i++) {
      for (let j=0; j<this.cached_rows[i].length; j++) {
        if (('' + this.cached_rows[i][j]).includes(searchvalue)) {
          this.rows[this.rows.length] = this.cached_rows[i];
          break;
        }
      }
    }
  }

  // on click function of edit table entry button
  editTableEntry(): void {

    // query all columns
    let rows = <HTMLCollectionOf<HTMLInputElement>>document.getElementsByClassName('form-control column-identity');
    let map = JSON.parse("{}");

    // parse tows to map
    for (let i=0; i<rows.length; i++) {
      map[rows.item(i).id.split('-')[1]] = rows.item(i).value;
    }

    // call api
    this.api.editTableEntry(this.table_name, this.getIdFromRow(this.edit_row), map)
      .subscribe(data => {
        if (data.message == 'Successfully updated entry') {
          location.reload();
        } else {
          this.popup.showAsComponent(data.message, data.alert);
          this.popup.closePopup(1000);
        }
      });
  }

  // calculates width for every table column
  calculateColumnWidthCSS(arr: any): string {
    let len = arr.length;
    return 'width: ' + (900 / len)  + 'px;';
  }

  // sets editing row
  initializeEntryEditing(row: any): void {
    for (let i=0; i<this.columns.length; i++) {
      this.length_counter[i] = i;
    }
    this.edit_row = row;

  }

  // reloads the page
  rl(): void {
    location.reload();
  }

  // enables column name input change
  onColumnNameInputChange(): void {
    let element = document.querySelector('#column-name-update-btn') as HTMLButtonElement;
    element.disabled = false;
    element.classList.remove('disabled');
  }

  // enables column name input change
  onTablenameChange(): void {
    let element = document.querySelector('#table-tablename-btn') as HTMLButtonElement;
    element.classList.remove('disabled');
    element.disabled = false;
  }

  // updates table-name
  updateTableName(name: string): void {
    this.api.updateTableName(this.table_name, name)
      .subscribe(data => {
        if (data.message == 'Successfully updated tablename') {
          new CookieHandler().setCookie('active-table', name, 1);
          location.reload();
        } else {
          this.popup.showAsComponent(data.message, data.alert);
          this.popup.closePopup(1000);
        }
      });
  }

  // updates column name on button click
  updateColumnName(oldName: string, newName: string): void {
    this.api.updateColumnName(this.table_name, oldName, newName)
      .subscribe(data => {
        if (data.message == 'Successfully changed column name') {
          location.reload();
        } else {
          this.popup.showAsComponent(data.message, data.alert);
          this.popup.closePopup(1000);
        }
      })
  }

  // switch handler
  onColumnNameSwitch(event: any): void {
    (document.querySelector('#column-name-input') as HTMLInputElement).value = event.target.value;
  }

  // loads all permissions of table
  loadPermissions(tablename: string, min_perm_lvl: string): void {
    this.api.getAllPermissionsOfTable(tablename)
      .subscribe(data => {
        this.permGroups = new Utils().bubblesort_perm_array(data.perm_groups).reverse();
        this.min_perm_lvl = min_perm_lvl;
        let element = document.querySelector('#table-perm-min-select') as HTMLSelectElement;
        element.selectedIndex = +min_perm_lvl - 1;
      });
  }

  // adds entry to table
  addEntry(): void {

    // get input values
    let inputs = (document.getElementsByClassName('input') as HTMLCollectionOf<HTMLInputElement>);

    let json = JSON.parse('{}');

    // parse input values into json array
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

    this.api.addTableEntry(this.table_name, json)
      .subscribe(data => {
        this.popup.showAsComponent(data.message, data.alert);
        this.popup.closePopup(1000);
        new CookieHandler().setCookie('redirect-table', 'true', 365)
      });

  }

  // remove table entry
  removeEntry(id: number): void {
    this.api.removeTableEntry(this.table_name, id)
      .subscribe(data => {
        this.popup.showAsComponent(data.message, data.alert);
        this.popup.closePopup(1000);
      });
    new CookieHandler().setCookie('redirect-table', 'true', 365)
    location.reload();
  }

  // delete table
  deleteTable(): void {
    this.api.deleteTable(this.table_name).subscribe();
    location.reload();
  }

  // gets ID value from row array
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
