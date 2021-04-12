import { Injectable } from '@angular/core';
import {Constants} from "../../classes/constants";
import * as forge from 'node-forge';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  RSA: any;
  constructor() { }

  // This function encrypts the whole request
  // body with RSA
  async encrypt(data: string): Promise<any> {
    let key = await this.getKey();
    this.RSA = forge.pki.publicKeyFromPem(key);
    return window.btoa(this.RSA.encrypt(data, 'RSAES-PKCS1-V1_5'));
  }

  // This function gets the public key from the
  // backend and returns it
  private async getKey(): Promise<string> {
    let resp = await fetch(new Constants().API_Origin + '/publicKey', {
      method: 'GET',
      mode: 'cors'
    });
    return await resp.text();
  }

}
