import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-popup-window',
  templateUrl: './popup-window.component.html',
  styleUrls: ['./popup-window.component.css']
})
export class PopupWindowComponent {

  // defined inputs
  @Input() message: string;
  @Input() color: string;

  constructor() { }

}
