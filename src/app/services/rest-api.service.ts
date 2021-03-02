import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {DefaultResponse} from "../models/default-response";
import {CookieHandler} from "../../classes/cookie-handler";
import {Constants} from "../../classes/constants";
import {catchError} from "rxjs/operators";
import {ListAllPermissionGroupsResponse} from "../models/list-all-permission-groups-response";

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
}
