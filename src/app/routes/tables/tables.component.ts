import {Component, Inject, Injector, OnInit} from '@angular/core';
import {CookieHandler} from "../../../classes/cookie-handler";
import {Utils} from "../../../classes/utils";
import {RestAPIService} from "../../services/rest-api.service";
import {PopupWindowService} from "../../components/popup-window/popup-window.service";
import {TableModel} from "../../models/table-model";

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {
  tables: TableModel[];
  perm_lvls = [];
  permGroups = [];
  min_perm_lvl: number;
  active_table: string;

  constructor(
    @Inject('RestAPIService') private api: RestAPIService,
    injector: Injector,
    public popup: PopupWindowService
  ) { }

  ngOnInit(): void {

    // check login status
    this.api.getAccessToken().subscribe(data => {
      if (data == 'unauthorized') { location.href = '/login'; }
      else { this.api.sessionToken = data.token; }
    });

    // init permission level array
    for (let i=1; i<=100; i++) {
      this.perm_lvls[(i-1)] = i;
    }

    // queries all tables
    this.api.getAllTables()
      .subscribe(data => {
        this.tables = data.tables;
      });
  }

  // opens table in webapp
  openTable(name: string): void {
    new CookieHandler().setCookie('active-table', name, 1);
    location.href = '/view-table';
  }

  // deletes table
  deleteTable(name: string): void {
    this.api.deleteTable(name)
      .subscribe(data => {
          if (data.message == 'Successfully deleted table') {
            location.reload();
          } else {
            this.popup.showAsComponent(data.message, data.alert);
            this.popup.closePopup(1000);
          }
      })
  }

  // loads all permissions of table
  loadPermissions(tablename: string, min_perm_lvl: number): void {
    this.api.getAllPermissionsOfTable(tablename)
        .subscribe(data => {
          this.permGroups = new Utils().bubblesort_perm_array(data.perm_groups).reverse();
          this.min_perm_lvl = min_perm_lvl;
          let element = document.querySelector('#table-perm-min-select') as HTMLSelectElement;
          element.selectedIndex = min_perm_lvl - 1;
          this.active_table = tablename;
        });
  }

  // updates minimum permission level
  updateMinPermlvl(newLvl: string): void {
    this.api.editTableMinPermLvl(this.active_table, +newLvl)
      .subscribe(data => {
        this.popup.showAsComponent(data.message, data.alert);
        this.popup.closePopup(1000);
      })
  }


  // on perm lvl change
  onMinPermLvlChange(): void {
    let element = document.querySelector('#table-update-btn') as HTMLButtonElement;
    element.classList.remove('disabled');
    element.disabled = false;
  }

}
