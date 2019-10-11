import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../../../models/item.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styles: []
})
export class ItemComponent implements OnInit {
  @Input() item: Item;
  @Input() index: number;
  
  constructor() { }

  ngOnInit() {
  }

}
