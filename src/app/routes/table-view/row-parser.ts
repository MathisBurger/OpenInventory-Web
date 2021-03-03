export class RowParser {

  parse(json: any, columns: any): any {
    var rows = [];
    for (let i=0; i<json.length; i++) {
      var row = [];

      for (let x=0; x<columns.length; x++) {
        let element = this.parseRowElement(json[i][columns[x].COLUMN_NAME], columns[x].COLUMN_NAME);
        row.push(element);
      }
      rows.push(row);
    }
    return rows;
  }

  private parseRowElement(element: any, name: string): string {
    if (name == 'id') {
      return element;
    }
    var keys = [];
    for (var k in element) {
      keys.push(k);
    }
    if (!keys.includes('Valid') && keys.length > 0) {
      return atob(element);
    } else {
      return element;
    }
  }

}
