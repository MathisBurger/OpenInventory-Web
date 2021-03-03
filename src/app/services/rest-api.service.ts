import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {DefaultResponse} from "../models/default-response";
import {CookieHandler} from "../../classes/cookie-handler";
import {Constants} from "../../classes/constants";
import {catchError} from "rxjs/operators";
import {ListAllPermissionGroupsResponse} from "../models/list-all-permission-groups-response";
import {GetSystemInfoResponse} from "../models/get-system-info-response";
import {GetTableContentResponse} from "../models/get-table-content-response";
import {GetTableColumnsResponse} from "../models/get-table-columns-response";
import {ListAllPermGroupsOfTableResponse} from "../models/list-all-perm-groups-of-table-response";
import {GetAllTablesResponse} from "../models/get-all-tables-response";

@Injectable({
  providedIn: 'root'
})
export class RestAPIService {

  BASE_URL: string;

  // error handler
  // throws console error
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  // initializing http client and BASE_URL
  constructor(private client: HttpClient) {this.BASE_URL = new Constants().API_Origin}

  // check login credentials POST endpoint
  checkCreds(): Observable<DefaultResponse> {
    let creds = new CookieHandler().getLoginCreds();
    return this.client.post<DefaultResponse>(this.BASE_URL + '/check-creds', {
                username: creds[0],
                password: creds[1],
                token: creds[2]
              }).pipe(catchError(this.handleError));
  }

  // tries to login the user
  login(username: string, password: string): Observable<DefaultResponse> {
    return this.client.post<DefaultResponse>(this.BASE_URL + '/login', {
      username: username,
      password: password
    }).pipe(catchError(this.handleError));
  }

  // creates a table with given values
  createTable(name: string, tuples: any, minPermLvl: number): Observable<DefaultResponse> {
    let creds = new CookieHandler().getLoginCreds();
    return this.client.post<DefaultResponse>(this.BASE_URL + '/table-management/createTable', {
      username: creds[0],
      password: creds[1],
      token: creds[2],
      table_name: name,
      row_config: tuples.toString(),
      min_perm_lvl: minPermLvl
    }).pipe(catchError(this.handleError));
  }

  // fetches all permissions
  getAllPermissionGroups(): Observable<ListAllPermissionGroupsResponse> {
    let creds = new CookieHandler().getLoginCreds();
    return this.client.post<ListAllPermissionGroupsResponse>(this.BASE_URL + '/permission-management/listAllPermissionGroups', {
      username: creds[0],
      password: creds[1],
      token: creds[2]
    }).pipe(catchError(this.handleError));
  }

  // creates permission group from values
  createPermissionGroup(perm_name: string, perm_color: string, perm_lvl: number): Observable<DefaultResponse> {
    let creds = new CookieHandler().getLoginCreds();
    return this.client.post<DefaultResponse>(this.BASE_URL + '/permission-management/createPermissionGroup', {
      username: creds[0],
      password: creds[1],
      token: creds[2],
      permission_info: {
        name: perm_name,
        color_code: perm_color,
        permission_level: perm_lvl
      }
    }).pipe(catchError(this.handleError));
  }

  deletePermissionGroup(group_name: string): Observable<DefaultResponse> {
    let creds = new CookieHandler().getLoginCreds();
    return this.client.post<DefaultResponse>(this.BASE_URL + '/permission-management/deletePermissionGroup', {
      username: creds[0],
      password: creds[1],
      token: creds[2],
      group_name: group_name
    }).pipe(catchError(this.handleError));
  }

  // returns basic system information
  getSystemInfo(): Observable<GetSystemInfoResponse> {
    return this.client.get<GetSystemInfoResponse>(this.BASE_URL + '/info')
      .pipe(catchError(this.handleError));
  }

  // queries the content of given table
  getTableContent(tablename: string): Observable<GetTableContentResponse> {
    let creds = new CookieHandler().getLoginCreds();
    return this.client.post<GetTableContentResponse>(this.BASE_URL + '/table-management/getTableContent', {
      username: creds[0],
      password: creds[1],
      token: creds[2],
      table_name: tablename
    }).pipe(catchError(this.handleError));
  }

  // queries all table columns of given table
  getTableColumns(tablename: string): Observable<GetTableColumnsResponse> {
    let creds = new CookieHandler().getLoginCreds();
    return this.client.post<GetTableColumnsResponse>(this.BASE_URL + '/table-management/getTableColumns', {
      username: creds[0],
      password: creds[1],
      token: creds[2],
      table_name: tablename
    }).pipe(catchError(this.handleError));
  }

  // edits table entry
  editTableEntry(tablename: string, objectID: number, row: any): Observable<DefaultResponse> {
    let creds = new CookieHandler().getLoginCreds();
    return this.client.post<DefaultResponse>(this.BASE_URL + '/table-management/editTableEntry', {
      username: creds[0],
      password: creds[1],
      token: creds[2],
      table_name: tablename,
      object_id: objectID,
      row: row
    }).pipe(catchError(this.handleError));
  }

  // updates table name
  updateTableName(oldName: string, newName: string): Observable<DefaultResponse> {
    let creds = new CookieHandler().getLoginCreds();
    return this.client.post<DefaultResponse>(this.BASE_URL + '/table-management/renameTable', {
            username: creds[0],
            password: creds[1],
            token: creds[2],
            table_name: oldName,
            new_name: newName
          }).pipe(catchError(this.handleError));
  }

  // updates column name
  updateColumnName(tablename: string, oldName: string, newName: string): Observable<DefaultResponse> {
    let creds = new CookieHandler().getLoginCreds();
    return this.client.post<DefaultResponse>(this.BASE_URL + '/table-management/renameTableColumn', {
      username: creds[0],
      password: creds[1],
      token: creds[2],
      table_name: tablename,
      old_name: oldName,
      new_name: newName
    }).pipe(catchError(this.handleError));
  }

  // queries all permissions of table
  getAllPermissionsOfTable(tablename: string): Observable<ListAllPermGroupsOfTableResponse> {
    let creds = new CookieHandler().getLoginCreds();
    return this.client.post<ListAllPermGroupsOfTableResponse>(this.BASE_URL + '/permission-management/ListAllPermGroupsOfTable', {
      username: creds[0],
      password: creds[1],
      token: creds[2],
      table_name: tablename
    }).pipe(catchError(this.handleError));
  }

  // adds entry to table
  addTableEntry(tablename: string, entry: any): Observable<DefaultResponse> {
    let creds = new CookieHandler().getLoginCreds();
    return this.client.post<DefaultResponse>(this.BASE_URL + '/table-management/AddTableEntry', {
      username: creds[0],
      password: creds[1],
      token: creds[2],
      table_name: tablename,
      row: entry
    }).pipe(catchError(this.handleError));
  }

  // removes entry from table
  removeTableEntry(tablename: string, rowID: number): Observable<DefaultResponse> {
    let creds = new CookieHandler().getLoginCreds();
    return this.client.post<DefaultResponse>(this.BASE_URL + '/table-management/RemoveTableEntry', {
      username: creds[0],
      password: creds[1],
      token: creds[2],
      table_name: tablename,
      row_id: rowID
    }).pipe(catchError(this.handleError));
  }

  // deletes table
  deleteTable(name: string): Observable<DefaultResponse> {
    let creds = new CookieHandler().getLoginCreds();
    return this.client.post<DefaultResponse>(this.BASE_URL + '/table-management/DeleteTable', {
      username: creds[0],
      password: creds[1],
      token: creds[2],
      table_name: name,
    }).pipe(catchError(this.handleError));
  }

  getAllTables(): Observable<GetAllTablesResponse> {
    let creds = new CookieHandler().getLoginCreds();
    return this.client.post<GetAllTablesResponse>(this.BASE_URL + '/table-management/getAllTables', {
      username: creds[0],
      password: creds[1],
      token: creds[2]
    }).pipe(catchError(this.handleError));
  }

  editTableMinPermLvl(name: string, lvl: number): Observable<DefaultResponse> {
    let creds = new CookieHandler().getLoginCreds();
    return this.client.post<DefaultResponse>(this.BASE_URL + '/permission-management/editTableMinPermLvl',
      {
        username: creds[0],
        password: creds[1],
        token: creds[2],
        table_name: name,
        new_lvl: lvl
      }).pipe(catchError(this.handleError));
  }
}
