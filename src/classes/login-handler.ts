import {Constants} from "./constants";
import {CookieHandler} from "./cookie-handler";

export class LoginHandler {


  async Login(username: string, password: string, ext: number): Promise<void> {
    let res = await fetch(new Constants().API_Origin + '/login', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        username: username,
        password: password,
      })
    });
    let data = await res.json()
    if (data.message == 'Login successful') {
      new CookieHandler().setLoginCreds(username, password, data.token, ext);
      location.href = '/dashboard';
    } else {
      alert('Login credentials wrong. Please try again.');
    }
  }

  async checkCreds(): Promise<void> {
    let creds = new CookieHandler().getLoginCreds();
    let req = await fetch(new Constants().API_Origin + '/check-creds', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        username: creds[0],
        password: creds[1],
        token: creds[2]
      })
    });
    let resp = await req.json();
    if (resp.message != 'Login successful') {
      location.href = '/login';
    }
  }
}
