export class Constants {
  public API_Origin = 'http://localhost:8080/api';

  constructor() {
    this.API_Origin = location.protocol + '//' + location.hostname + ':' + location.port +  '/api';
    //this.API_Origin = 'https://openinventory-test.mathis.burger.de/api';
  }
}
