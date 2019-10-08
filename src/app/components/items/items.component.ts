import { Component, OnInit, OnChanges } from '@angular/core';

import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html'
})
export class ItemsComponent implements OnInit {
  items: Item[];
  documentForm: FormGroup;
  constructor( 
    private itemService: ItemService,
    private afAuth: AngularFireAuth
    ) {}

  ngOnInit() {
    this.itemService.getItems().subscribe(items => {
      this.items = items;
    });
    // let documentName = '';
    // let documentTimes = '';
    // this.documentForm = new FormGroup({
    //   name: new FormControl(documentName, Validators.required),
    //   times: new FormControl(documentTimes, Validators.required),
    // });
    // this.onChanges();
  }

  onChange($event, item) {
    this.updateItem(item);
    // I want to do something here for new selectedDevice, but what I
    // got here is always last selection, not the one I just select.
  }

  // onChanges() {
    // console.log('ok');
    // this.documentForm.valueChanges.subscribe(val => {
    //  console.log(val);
    // });
  // }

  deleteItem(event, item: Item) {
    this.itemService.deleteItem(item);
  }

  updateItem(item: Item) {
    this.itemService.updateItem(item);
  }

}
