export class RowParser {

  // parses json array to row-arrays
  parse(json: any, columns: any): any {
    var rows = [];

    // iterate trough json array
    for (let i=0; i<json.length; i++) {
      var row = [];

      // iterate trough given columns
      for (let x=0; x<columns.length; x++) {

        // parse json to array
        let element = this.parseRowElement(json[i][columns[x].COLUMN_NAME], columns[x].COLUMN_NAME);
        row.push(element);
      }
      rows.push(row);
    }
    return rows;
  }

  // parses row element to array
  private parseRowElement(element: any, name: string): string {

    // id is always a number
    if (name == 'id') {
      return element;
    }

    var keys = [];

    // get key names of map
    for (var k in element) {
      keys.push(k);
    }

    // get element by key
    if (!keys.includes('Valid') && keys.length > 0) {
      return atob(element);
    } else {
      return element;
    }
  }

}
