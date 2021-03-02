import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {DefaultResponse} from "../models/default-response";
import {CookieHandler} from "../../classes/cookie-handler";
import {Constants} from "../../classes/constants";
import {catchError} from "rxjs/operators";

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
}
