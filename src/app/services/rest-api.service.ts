import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
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
import {ListUserResponse} from "../models/list-user-response";
import {ListAllPermsOfUser} from "../models/list-all-perms-of-user";

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
    let params = new HttpParams();
    params = params.append('username', creds[0]).append('password', creds[1]).append('token', creds[2]);
    return this.client.get<ListAllPermissionGroupsResponse>(this.BASE_URL + '/permission-management/listAllPermissionGroups', {params}).pipe(catchError(this.handleError));
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
    let params = new HttpParams().append('username', creds[0]).append('password', creds[1])
      .append('token', creds[2]).append('table_name', tablename);
    return this.client.get<GetTableContentResponse>(this.BASE_URL + '/table-management/getTableContent', {params}).pipe(catchError(this.handleError));
  }

  // queries all table columns of given table
  getTableColumns(tablename: string): Observable<GetTableColumnsResponse> {
    let creds = new CookieHandler().getLoginCreds();
    let params = new HttpParams().append('username', creds[0]).append('password', creds[1])
      .append('token', creds[2]).append('table_name', tablename);
    return this.client.get<GetTableColumnsResponse>(this.BASE_URL + '/table-management/getTableColumns', {params}).pipe(catchError(this.handleError));
  }

  // edits table entry
  editTableEntry(tablename: string, objectID: number, row: any): Observable<DefaultResponse> {
    let creds = new CookieHandler().getLoginCreds();
    return this.client.patch<DefaultResponse>(this.BASE_URL + '/table-management/editTableEntry', {
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
    return this.client.patch<DefaultResponse>(this.BASE_URL + '/table-management/renameTable', {
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
    return this.client.patch<DefaultResponse>(this.BASE_URL + '/table-management/renameTableColumn', {
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
    let params = new HttpParams().append('username', creds[0]).append('password', creds[1])
      .append('token', creds[2]).append('table_name', tablename);
    return this.client.get<ListAllPermGroupsOfTableResponse>(this.BASE_URL + '/permission-management/ListAllPermGroupsOfTable', {params}).pipe(catchError(this.handleError));
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

  // queries all tables
  getAllTables(): Observable<GetAllTablesResponse> {
    let creds = new CookieHandler().getLoginCreds();
    let params = new HttpParams().append('username', creds[0]).append('password', creds[1])
      .append('token', creds[2]);
    return this.client.get<GetAllTablesResponse>(this.BASE_URL + '/table-management/getAllTables', {params}).pipe(catchError(this.handleError));
  }

  // edit minimum permission level
  editTableMinPermLvl(name: string, lvl: number): Observable<DefaultResponse> {
    let creds = new CookieHandler().getLoginCreds();
    return this.client.patch<DefaultResponse>(this.BASE_URL + '/permission-management/editTableMinPermLvl',
      {
        username: creds[0],
        password: creds[1],
        token: creds[2],
        table_name: name,
        new_lvl: lvl
      }).pipe(catchError(this.handleError));
  }

  // queries all user
  getAllUser(): Observable<ListUserResponse> {
    let creds = new CookieHandler().getLoginCreds();
    let params = new HttpParams().append('username', creds[0]).append('password', creds[1])
      .append('token', creds[2]);
    return this.client.get<ListUserResponse>(this.BASE_URL + '/user-management/ListUser', {params}).pipe(catchError(this.handleError));
  }

  // list all permissions of user
  listAllPermsOfUser(username: string): Observable<ListAllPermsOfUser> {
    let creds = new CookieHandler().getLoginCreds();
    let params = new HttpParams().append('username', creds[0]).append('password', creds[1])
      .append('token', creds[2]).append('user', username);
    return this.client.get<ListAllPermsOfUser>(this.BASE_URL + '/permission-management/listAllPermsOfUser', {params}).pipe(catchError(this.handleError));
  }

  // adds user to permission
  addUserToPermissionGroup(permission: string, username: string): Observable<DefaultResponse> {
    let creds = new CookieHandler().getLoginCreds();
    return this.client.post<DefaultResponse>(this.BASE_URL + '/permission-management/addUserToPermissionGroup', {
        username: creds[0],
        password: creds[1],
        token: creds[2],
        permission: permission,
        user: username
      }).pipe(catchError(this.handleError));
  }

  // removes permission from user
  removeUserFromPermissionGroup(user: string, perm: string): Observable<DefaultResponse> {
    let creds = new CookieHandler().getLoginCreds();
    return this.client.post<DefaultResponse>(this.BASE_URL + '/permission-management/removeUserFromPermissionGroup', {
      username: creds[0],
      password: creds[1],
      token: creds[2],
      permission_name: perm,
      user: user
    }).pipe(catchError(this.handleError));
  }

  // adds user to system
  addUser(username: string, password: string, root: boolean, mail: string, status: string): Observable<DefaultResponse> {
    let loginCreds = new CookieHandler().getLoginCreds();
    return this.client.post<DefaultResponse>(this.BASE_URL + '/user-management/AddUser', {
      username: loginCreds[0],
      password: loginCreds[1],
      token: loginCreds[2],
      user: {
        username: username,
        password: password,
        root: root,
        mail: mail,
        status: status
      }
    }).pipe(catchError(this.handleError));
  }

  // deletes user from system
  deleteUser(name: string): Observable<DefaultResponse> {
    let creds = new CookieHandler().getLoginCreds();
    return this.client.post<DefaultResponse>(this.BASE_URL + '/user-management/DeleteUser', {
      username: creds[0],
      password: creds[1],
      token: creds[2],
      user: name
    }).pipe(catchError(this.handleError));
  }
}
