import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html'
})
export class AddItemComponent implements OnInit {
  item: Item = {
    id: '',
    day: '',
    muscles: '',
    exercises: []
  }
  thing: {name: ''};
  things: any = [{name: ''}];

  

  constructor(private itemService: ItemService) { }

  ngOnInit() {
   
    // this.things = [
    //   { name: ''},
    // ];
    // this.item.exercises.push(
    //   { "name": "Squat", "reps": ["8", "16", "8", "16"], "weights": ["25", "25", "60", "25"]} 
    // );
    // console.log(this.things);
  }

  onAddThing() {
    this.things.push(this.thing.name);
    // console.log(this.things);
  }

  onDeleteThing(index: number) {
    this.things.splice(index, 1);
    console.log(this.things);
  }

  register(form) {
    console.log(form.value);
  }

  // onSubmit() {
  //   if (this.item.day != '' && this.item.muscles != '') {
  //     this.itemService.addItem(this.item);
  //     this.item.day = '';
  //     this.item.muscles = '';
  //     this.item.exercises = this.things;
  //   }
  // }

}
