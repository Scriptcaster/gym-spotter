import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { WeekService } from '../../../services/week.service';

@Component({
  selector: 'app-day-edit',
  templateUrl: './day-edit.component.html',
  styleUrls: ['./day-edit.component.scss']
})
export class DayEditComponent implements OnInit {
  weekId: any;
  index: number;
  isEdit = false;
  theForm: FormGroup;
  tempForm: FormGroup;
  breakpoint: number;
  volume: number;
  volumeArray: any[];
  weeklyVolume: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private weekService: WeekService, 
  ) {}

  ngOnInit() {
    this.breakpoint = (window.innerWidth > 400) ? 25 : 100;
    this.route.params.subscribe((params: Params) => {
     
      this.weekId = params['week'];
      this.index = +params['id'];
      this.isEdit = params['id'] != null;

      this.theForm = new FormGroup({
        id: new FormControl(''),
        date: new FormControl(''),
        target: new FormControl(''),
        volume: new FormControl(''),
        exercises: new FormArray([])
      });
    
      // if(this.isEdit) {
      this.weekService.getDays(this.weekId).subscribe(item => {
        item = item.sort((a, b) => a.index - b.index);

        this.volumeArray = item.map(item => {
         return item.volume;
        });
               
        this.theForm.patchValue({
          id: item[this.index].id,
          date: item[this.index].date,
          target: item[this.index].target,
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
      // }
      // this.theForm.valueChanges.subscribe(console.log);

    });

    
    this.theForm.valueChanges.subscribe(() => {
      let array = [];
      this.theForm.value.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          array.push(set);
        });
      });
      this.volume = array.map(set => set.rep * set.weight).reduce((currentTotal, item) => {
        return item + currentTotal
      }, 0);
      this.volumeArray[this.index] = this.volume;
      this.weeklyVolume = this.volumeArray.reduce((currentTotal, item) => {
        return item + currentTotal
      }, 0);
    });
    // this.theForm.controls['target'].valueChanges.subscribe(change => {
    //   console.log(change);
    // });
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
    if (control['controls'][j]) {
      control.push(control['controls'][j]);
    } else {
      control.push(this.initSets());
    }
  }
  removeSet(i, j) {
    <FormArray>this.theForm.get('exercises')['controls'][i].get('sets').removeAt(j);
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
  cancelItem() {
    this.theForm.markAsPristine();
    this.theForm.reset();
    this.router.navigate(['../']);
  }
   submitItem() {
    if (this.theForm.value != '') {
    //   if (this.isEdit) {
      this.theForm.value.volume = this.volume;
      this.weekService.updateDay(this.weekId, this.theForm.value, this.weeklyVolume);
      // } else {
        // this.weekService.addWeek(this.week, this.theForm.value);
      // }
      this.cancelItem();
    }
  }
  deleteItem() {
    this.weekService.deleteWeek(this.theForm.value);
    this.cancelItem();
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 100 : 100;
    this.breakpoint = (event.target.innerWidth > 400) ? 25 : 100;
  }
}