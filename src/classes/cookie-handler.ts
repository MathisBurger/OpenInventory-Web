export class CookieHandler {
  constructor() {}

  getLoginCreds(): string[] {
    let arr = [];
    if (this.getCookie('username') != ''){
      arr[0] = this.getCookie('username');
    } else {
      arr[0] = 'None';
      this.setCookie('username', 'None', 1);
    }
    if (this.getCookie('password') != ''){
      arr[1] = this.getCookie('password');
    } else {
      arr[1] = 'None';
      this.setCookie('password', 'None', 1);
    }
    if (this.getCookie('token') != ''){
      arr[2] = this.getCookie('token');
    } else {
      arr[2] = 'None';
      this.setCookie('token', 'None', 1);
    }
    return arr;
  }


  private setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  private getCookie(cname): string {
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
