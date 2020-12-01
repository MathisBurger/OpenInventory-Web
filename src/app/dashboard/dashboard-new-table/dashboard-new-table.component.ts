import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-new-table',
  templateUrl: './dashboard-new-table.component.html',
  styleUrls: ['./dashboard-new-table.component.css']
})
export class DashboardNewTableComponent implements OnInit {

  column_length = [];
  show_column_selection = false;
  constructor() { }

  ngOnInit(): void {
  }

  onColumnNumSubmit(): void {
    let val = (document.getElementById('new-table-colum-lengh-input') as HTMLInputElement).valueAsNumber;
    if (val == 0 || val == Number.NaN || val < 0 || !Number.isInteger(val)) {
      alert('You have to input an value greater than 0 as integer')
    } else {
      for (let i=0; i<val; i++){
        this.column_length[i] = (i as number);
      }
      this.show_column_selection = true;
    }
  }

}
