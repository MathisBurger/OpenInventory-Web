import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {DefaultResponse} from "../models/default-response";
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
import { AccessToken } from '../models/access-token';
import {compareSegments} from "@angular/compiler-cli/src/ngtsc/sourcemaps/src/segment_marker";

@Injectable({
  providedIn: 'root'
})
export class RestAPIService {

  BASE_URL: string;

  public sessionToken: string;

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

  // handles the error of login functions
  // returns "FAILED" as observable
  private handleAuthError(error: HttpErrorResponse): Observable<string> {
    console.log(error.message);
    return new Observable<string>(subscriber => {
      subscriber.next('FAILED');
      subscriber.complete();
    });
  }

  // handles the error if a refresh token is not valid
  // only allowed for requesting new accessToken
  private handleAuthTokenError(error: HttpErrorResponse): Observable<string> {
    return new Observable<string>(subscriber => {
      subscriber.next('unauthorized');
      subscriber.complete();
    })
  }

  // This function executes the login functions
  // and returns the login status
  login(username: string, password: string): Observable<string>{
    return this.client.post<any>(
      this.BASE_URL + '/auth/login',
      {
        username: username,
        password: password
      },
      {withCredentials: true, responseType: 'text' as 'json'}
    ).pipe(catchError(this.handleAuthError));
  }

  // This function sends the 2fa code to the server to
  // verify it
  twoFactorAuth(token: string, username: string, code: string): Observable<string> {
    let params = new HttpParams().append('token', token)
      .append('username', username).append('code', code);
    return this.client.post<any>(
      this.BASE_URL + '/auth/2fa',
      {},
      {params, responseType: 'text' as 'json'}
    ).pipe(catchError(this.handleAuthError));
  }

  // queries the API to generate a short life accessToken
  // bases on the long life refreshToken
  getAccessToken(): Observable<any> {
    return this.client.get<AccessToken>(this.BASE_URL + '/auth/accessToken', {
      withCredentials: true
    }).pipe(catchError(this.handleAuthTokenError));
  }

  // This auth endpoint revokes the current session
  // and deletes all data about this session in
  // the database, except trading information
  revokeSession(): Observable<any> {
    return this.client.post<any>(this.BASE_URL + '/auth/revokeSession', {}, {
      withCredentials: true,
      headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
    }).pipe(catchError(this.handleAuthError));
  }

  // creates a table with given values
  createTable(name: string, tuples: any, minPermLvl: number): Observable<DefaultResponse> {
    return this.client.post<DefaultResponse>(this.BASE_URL + '/table-management/createTable', {
      table_name: name,
      row_config: tuples.toString(),
      min_perm_lvl: minPermLvl
    }, {
      withCredentials: true,
      headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
    }).pipe(catchError(this.handleError));
  }

  // fetches all permissions
  getAllPermissionGroups(): Observable<ListAllPermissionGroupsResponse> {
    return this.client.get<ListAllPermissionGroupsResponse>(this.BASE_URL + '/permission-management/listAllPermissionGroups', {
      withCredentials: true,
      headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
    }).pipe(catchError(this.handleError));
  }

  // creates permission group from values
  createPermissionGroup(perm_name: string, perm_color: string, perm_lvl: number): Observable<DefaultResponse> {
    return this.client.post<DefaultResponse>(this.BASE_URL + '/permission-management/createPermissionGroup', {
      permission_info: {
        name: perm_name,
        color_code: perm_color,
        permission_level: perm_lvl
      }
    }, {
      withCredentials: true,
      headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
    }).pipe(catchError(this.handleError));
  }

  deletePermissionGroup(group_name: string): Observable<DefaultResponse> {
    return this.client.post<DefaultResponse>(this.BASE_URL + '/permission-management/deletePermissionGroup', {
      group_name: group_name
    }, {
      withCredentials: true,
      headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
    }).pipe(catchError(this.handleError));
  }

  // returns basic system information
  getSystemInfo(): Observable<GetSystemInfoResponse> {
    return this.client.get<GetSystemInfoResponse>(this.BASE_URL + '/info')
      .pipe(catchError(this.handleError));
  }

  // queries the content of given table
  getTableContent(tablename: string): Observable<GetTableContentResponse> {
    let params = new HttpParams().append('table_name', tablename);
    return this.client.get<GetTableContentResponse>(this.BASE_URL + '/table-management/getTableContent', {
      params: params,
      withCredentials: true,
      headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
    }).pipe(catchError(this.handleError));
  }

  // queries all table columns of given table
  getTableColumns(tablename: string): Observable<GetTableColumnsResponse> {
    let params = new HttpParams().append('table_name', tablename);
    return this.client.get<GetTableColumnsResponse>(this.BASE_URL + '/table-management/getTableColumns', {
      params: params,
      withCredentials: true,
      headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
    }).pipe(catchError(this.handleError));
  }

  // edits table entry
  editTableEntry(tablename: string, objectID: number, row: any): Observable<DefaultResponse> {
    return this.client.patch<DefaultResponse>(this.BASE_URL + '/table-management/editTableEntry', {
      table_name: tablename,
      object_id: objectID,
      row: row
    }, {
      withCredentials: true,
      headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
    }).pipe(catchError(this.handleError));
  }

  // updates table name
  updateTableName(oldName: string, newName: string): Observable<DefaultResponse> {
    return this.client.patch<DefaultResponse>(this.BASE_URL + '/table-management/renameTable', {
            table_name: oldName,
            new_name: newName
          }, {
            withCredentials: true,
            headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
          }).pipe(catchError(this.handleError));
  }

  // updates column name
  updateColumnName(tablename: string, oldName: string, newName: string): Observable<DefaultResponse> {
    return this.client.patch<DefaultResponse>(this.BASE_URL + '/table-management/renameTableColumn', {
      table_name: tablename,
      old_name: oldName,
      new_name: newName
    }, {
      withCredentials: true,
      headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
    }).pipe(catchError(this.handleError));
  }

  // queries all permissions of table
  getAllPermissionsOfTable(tablename: string): Observable<ListAllPermGroupsOfTableResponse> {
    let params = new HttpParams().append('table_name', tablename);
    return this.client.get<ListAllPermGroupsOfTableResponse>(this.BASE_URL + '/permission-management/ListAllPermGroupsOfTable', {
      params: params,
      withCredentials: true,
      headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
    }).pipe(catchError(this.handleError));
  }

  // adds entry to table
  addTableEntry(tablename: string, entry: any): Observable<DefaultResponse> {
    return this.client.post<DefaultResponse>(this.BASE_URL + '/table-management/AddTableEntry', {
      table_name: tablename,
      row: entry
    }, {
      withCredentials: true,
      headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
    }).pipe(catchError(this.handleError));
  }

  // removes entry from table
  removeTableEntry(tablename: string, rowID: number): Observable<DefaultResponse> {
    return this.client.post<DefaultResponse>(this.BASE_URL + '/table-management/RemoveTableEntry', {
      table_name: tablename,
      row_id: rowID
    }, {
      withCredentials: true,
      headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
    }).pipe(catchError(this.handleError));
  }

  // deletes table
  deleteTable(name: string): Observable<DefaultResponse> {
    return this.client.post<DefaultResponse>(this.BASE_URL + '/table-management/DeleteTable', {
      table_name: name,
    }, {
      withCredentials: true,
      headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
    }).pipe(catchError(this.handleError));
  }

  // queries all tables
  getAllTables(): Observable<GetAllTablesResponse> {
    return this.client.get<GetAllTablesResponse>(this.BASE_URL + '/table-management/getAllTables', {
      withCredentials: true,
      headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
    }).pipe(catchError(this.handleError));
  }

  // edit minimum permission level
  editTableMinPermLvl(name: string, lvl: number): Observable<DefaultResponse> {
    return this.client.patch<DefaultResponse>(this.BASE_URL + '/permission-management/editTableMinPermLvl', {
        table_name: name,
        new_lvl: lvl
      }, {
        withCredentials: true,
        headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
      }).pipe(catchError(this.handleError));
  }

  // queries all user
  getAllUser(): Observable<ListUserResponse> {
    return this.client.get<ListUserResponse>(this.BASE_URL + '/user-management/ListUser', {
      withCredentials: true,
      headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
    }).pipe(catchError(this.handleError));
  }

  // list all permissions of user
  listAllPermsOfUser(username: string): Observable<ListAllPermsOfUser> {
    let params = new HttpParams().append('user', username);
    return this.client.get<ListAllPermsOfUser>(this.BASE_URL + '/permission-management/listAllPermsOfUser', {
      params: params,
      withCredentials: true,
      headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
    }).pipe(catchError(this.handleError));
  }

  // adds user to permission
  addUserToPermissionGroup(permission: string, username: string): Observable<DefaultResponse> {
    return this.client.post<DefaultResponse>(this.BASE_URL + '/permission-management/addUserToPermissionGroup', {
        permission: permission,
        user: username
      }, {
        withCredentials: true,
        headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
      }).pipe(catchError(this.handleError));
  }

  // removes permission from user
  removeUserFromPermissionGroup(user: string, perm: string): Observable<DefaultResponse> {
    return this.client.post<DefaultResponse>(this.BASE_URL + '/permission-management/removeUserFromPermissionGroup', {
      permission_name: perm,
      user: user
    }, {
      withCredentials: true,
      headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
    }).pipe(catchError(this.handleError));
  }

  // adds user to system
  addUser(username: string, password: string, root: boolean, mail: string, status: string): Observable<DefaultResponse> {
    return this.client.post<DefaultResponse>(this.BASE_URL + '/user-management/AddUser', {
      user: {
        username: username,
        password: password,
        root: root,
        mail: mail,
        status: status
      }
    }, {
      withCredentials: true,
      headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
    }).pipe(catchError(this.handleError));
  }

  // deletes user from system
  deleteUser(name: string): Observable<DefaultResponse> {
    return this.client.post<DefaultResponse>(this.BASE_URL + '/user-management/DeleteUser', {
      user: name
    }, {
      withCredentials: true,
      headers: new HttpHeaders({'Authorization': 'accessToken ' + this.sessionToken})
    }).pipe(catchError(this.handleError));
  }

}
