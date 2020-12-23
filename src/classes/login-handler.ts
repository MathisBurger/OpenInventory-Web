import {Var} from './var';
import {CookieHandler} from './cookie-handler';

export class LoginHandler {
  constructor() {}

  async status(): Promise<boolean> {
    let var1 = new Var().API_Origin;
    let creds = new CookieHandler().getLoginCreds(1);
    let res = await fetch(var1 + '/check-creds', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'applicaton/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'username': creds[0],
        'password': creds[1],
        'token': creds[2],
      })
    });
    let json = await res.json();
    if (json.message == 'Login successful'){
      return true;
    } else {
      return false;
    }
  }

  async login(username: string, pwd: string, ext: number): Promise<boolean> {
    let var1 = new Var().API_Origin;
    let res = await fetch(var1 + '/login', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'applicaton/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'username': username,
        'password': pwd,
        'token': 'None',
      })
    });
    let json = await res.json();
    if (json.message == 'Login successful'){
      new CookieHandler().setLoginCreds(username, pwd, json.token, ext);
      return true;
    } else {
      return false;
    }
  }
}
