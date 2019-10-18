import { Component, OnInit, Input } from '@angular/core';
import { Day } from '../../../models/day.model';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styles: []
})
export class DayComponent implements OnInit {
  @Input() day: Day;
  @Input() index: number;
  @Input() week: number;

  breakpoint;
  constructor() {}

  ngOnInit() {
    this.breakpoint = (window.innerWidth > 400) ? 2: 1;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 1;
    this.breakpoint = (event.target.innerWidth > 400) ? 2 : 1;
  }

}
