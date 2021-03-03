export class ColumnsRenderer {

  render(data: any): string {

    // HTML base
    var render = '<table><tr><td>Name</td><td>Value</td><td>Type</td></tr>';

    // iterate trough columns
    for (let i=0; i<data.columns.length; i++) {
      render += this.calculateHTML(data.columns[i]);
    }

    render += '</table>';
    return render;
  }

  // calculates input type
  private calculateHTML(json: any): string {

    // no input for id
    if (json.COLUMN_NAME == 'id') {
      return '';
    } else {
      // switch DATA_TYPE
      switch (json.DATA_TYPE) {
        case 'int':
          return '<tr><td>' + json.COLUMN_NAME + '</td><td><input type="number" maxlength="65535" step="1" class="form-control input" placeholder="' + json.COLUMN_NAME + '"></td><td>INT</td></tr>';
        case 'float':
          return '<tr><td>' + json.COLUMN_NAME + '</td><td><input type="number" maxlength="65535" class="form-control input" placeholder="' + json.COLUMN_NAME + '"></td><td>FLOAT</td></tr>';
        case 'tinyint':
          return '<tr><td>' + json.COLUMN_NAME + '</td><td><input type="checkbox" class="form-control input" placeholder="' + json.COLUMN_NAME + '"></td><td>BOOLEAN</td></tr>';
        case 'text':
          return '<tr><td>' + json.COLUMN_NAME + '</td><td><input type="text" class="form-control input" placeholder="' + json.COLUMN_NAME + '"></td><td>TEXT</td></tr>';
      }
    }
  }
}
