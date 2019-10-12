import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../models/item.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.scss',]
})
export class ItemEditComponent implements OnInit {
  index: number;
  isEdit = false;
  theForm: FormGroup;
  breakpoint;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService, 
  ) {}

  ngOnInit() {
    this.breakpoint = (window.innerWidth > 400) ? 2 : 1;
    this.route.params.subscribe((params: Params) => {
      this.index = +params['id'];
      this.isEdit = params['id'] != null;

      this.theForm = new FormGroup({
        schedule: new FormGroup({
          day: new FormControl(''),
          muscles: new FormControl('')
        }),
        exercises: new FormArray([]),
      });

      if(this.isEdit) {
        console.log(this.isEdit);
        this.itemService.getItems().subscribe(item => {
          this.theForm = new FormGroup({
            id: new FormControl( item[this.index].id ),
            schedule: new FormGroup({
              day: new FormControl(item[this.index].schedule.day),
              muscles: new FormControl(item[this.index].schedule.muscles)
            }),
            exercises: new FormArray([]),
          });

          if (item[this.index].exercises) {
            let setIndex = -1;
            for (let exercise of item[this.index].exercises) {
              setIndex ++;
              const control = <FormArray>this.theForm.get('exercises');
              control.push(
                new FormGroup({
                  name: new FormControl(exercise.name),
                  sets: new FormArray([])
                })
              );
      
              for (let set of exercise.sets) {
                console.log(setIndex);
                const control2 = <FormArray>this.theForm.get('exercises')['controls'][setIndex].get('sets');
                control2.push(
                  new FormGroup({
                    weight: new FormControl(set.weight),
                    rep: new FormControl(set.rep),
                  })
                );
              }

            }
          }

        });
      } 
    });
    // this.theForm.valueChanges.subscribe(console.log);
  }

  initExercises() {
    return new FormGroup({
      name: new FormControl(''),
      sets: new FormArray([
        this.initSets()
      ])
    });
  }
  initSets() {
    return new FormGroup({
      weight: new FormControl(''),
      rep: new FormControl(''),
    });
  }
  addExercise() {
    const control = <FormArray>this.theForm.get('exercises');
    control.push(this.initExercises());
  }
  addSet(j) {
    const control = <FormArray>this.theForm.get('exercises')['controls'][j].get('sets');
    control.push(this.initSets());
  }
  getExercises(form) {
    return form.controls.exercises.controls;
  }
  getSets(form) {
    return form.controls.sets.controls;
  }
  removeExercise(i) {
    const control = <FormArray>this.theForm.get('exercises');
    control.removeAt(i);
  }
  removeSet(j) {
    const control = <FormArray>this.theForm.get('exercises')['controls'][j].get('sets');
    control.removeAt(j);
  }
  // remove(i, j) {
  //   console.log('trigger');
  //   const control = <FormArray>this.theForm.get(['exercises', i, 'sets', j, 'options']);
  //   control.removeAt(0);
  //   control.controls = [];
  // }
  cancelItem() {
    this.theForm.markAsPristine();
    this.theForm.reset();
    this.router.navigate(['../']);
  }
   submitItem() {
    if (this.theForm.value != '') {
      if (this.isEdit) {
        this.itemService.updateItem(this.theForm.value);
      } else {
        this.itemService.addItem(this.theForm.value);
      }
      this.cancelItem();
    }
  }

  deleteItem() {
    this.itemService.deleteItem(this.theForm.value);
    this.cancelItem();
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 1;
    this.breakpoint = (event.target.innerWidth > 400) ? 2 : 1;
  }

}