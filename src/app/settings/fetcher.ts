import {Var} from '../../classes/var';
import {CookieHandler} from '../../classes/cookie-handler';

export class Fetcher {

  async getAllUser(): Promise<any> {
    let loginCreds = new CookieHandler().getLoginCreds();
    var resp = await fetch(new Var().API_Origin + '/table-management/ListUser', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'applicaton/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: loginCreds[0],
        password: loginCreds[1],
        token: loginCreds[2]
      })
    });
    var data = await resp.json();
    return data.user;
  }
}
