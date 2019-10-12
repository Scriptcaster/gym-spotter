import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html'
})
export class ItemsComponent implements OnInit {
  items: Item[];
  documentForm: FormGroup;
  constructor( 
    private itemService: ItemService,
    ) {}
  ngOnInit() {
    this.itemService.getItems().subscribe(items => {
      this.items = items;
      console.log(items[0].exercises[0].sets[0].weight);
    });
  }
  onChange($event, item) {
    this.updateItem(item);
  }
  deleteItem(event, item: Item) {
    this.itemService.deleteItem(item);
  }
  updateItem(item: Item) {
    this.itemService.updateItem(item);
  }
}
