import {Var} from './var';
import {CookieHandler} from './cookie-handler';

export class LoginHandler {
  constructor() {}

  async status(): Promise<boolean> {
    let var1 = new Var().API_Origin;
    let creds = new CookieHandler().getLoginCreds();
    await fetch(var1 + '/login', {
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
    }).then(res => res.json())
      .then(data => {
        if (data.message == 'Login successful'){
          return true;
        }
      });
      return false;
  }
}
