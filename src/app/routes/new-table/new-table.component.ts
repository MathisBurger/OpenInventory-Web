import {Component, Inject, Injector, OnInit} from '@angular/core';
import {RestAPIService} from "../../services/rest-api.service";
import {PopupWindowService} from "../../components/popup-window/popup-window.service";

@Component({
  selector: 'app-new-table',
  templateUrl: './new-table.component.html',
  styleUrls: ['./new-table.component.css']
})
export class NewTableComponent implements OnInit {

  constructor(
    @Inject('RestAPIService') private api: RestAPIService,
    injector: Injector,
    public popup: PopupWindowService
  ) { }
  column_length = [];
  show_column_selection = false;
  perm_lvls = [];

  // on load
  ngOnInit(): void {
    this.api.checkCreds().subscribe(data => {
      if (data.message != 'Login successful') { location.href = '/login'; }
    });

    // create list of all permission levels
    for (let i=1; i<=100; i++) {
      this.perm_lvls[(i-1)] = i;
    }
  }

  // on column size submit
  onColumnNumSubmit(val: number): void {
    // check if number if invalid
    if (val == 0 || val == Number.NaN || val < 0 || !Number.isInteger(val) || val == Number.EPSILON || val > 100) {
      this.popup.showAsComponent('You have to input an value greater than 0 and smaller than 100 as integer', '#d41717');
      this.popup.closePopup(3000);
    } else {
      // increase number of shown columns
      for (let i=0; i<val; i++){
        this.column_length[i] = (i as number);
      }

      // set columns visible
      this.show_column_selection = true;
    }
  }

  // on create table button click
  createTable(minpermlvl: string, tablename: string): void {

    let tuples = [];

    // fetching fields
    let field_names = (document.getElementsByClassName('newtable-field-name') as HTMLCollectionOf<HTMLInputElement>);
    let field_types = (document.getElementsByClassName('newtable-field-type') as HTMLCollectionOf<HTMLSelectElement>);

    // building tuples
    for (let i=0; i<field_names.length; i++) {
      tuples[tuples.length] = '(' + field_types[i].value + ';' +  field_names[i].value + ')';
    }

    // call API
    this.api.createTable(tablename, tuples, +minpermlvl)
      .subscribe(data => {
        this.popup.showAsComponent(data.message, data.alert);
        this.popup.closePopup(1000);
      });
  }

}
