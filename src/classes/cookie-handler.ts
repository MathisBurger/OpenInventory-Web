export class CookieHandler {

  constructor() {}

  // sets login cookies
  setLoginCreds(username: string, password: string, token: string, ext: number): void {
    this.setCookie('username', username, ext);
    this.setCookie('password', password, ext);
    this.setCookie('token', token, ext);
    this.setCookie('ext', ext, ext);
  }

  // returns login credentials from cookies
  getLoginCreds(ext: number = 1): string[] {
    let arr = [];
    if (this.getCookie('username') != ''){
      arr[0] = this.getCookie('username');
    } else {
      arr[0] = 'None';
      this.setCookie('username', 'None', ext);
    }
    if (this.getCookie('password') != ''){
      arr[1] = this.getCookie('password');
    } else {
      arr[1] = 'None';
      this.setCookie('password', 'None', ext);
    }
    if (this.getCookie('token') != ''){
      arr[2] = this.getCookie('token');
    } else {
      arr[2] = 'None';
      this.setCookie('token', 'None', ext);
    }
    return arr;
  }

  // set cookie
  setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  // get cookie
  getCookie(cname): string {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
}
