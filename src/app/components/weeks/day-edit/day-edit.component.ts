import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { WeekService } from '../../../services/week.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
@Component({
  selector: 'app-day-edit',
  templateUrl: './day-edit.component.html',
  styleUrls: ['./day-edit.component.scss']
})
export class DayEditComponent implements OnInit {
  // @Input() week: number;
  weekId: any;
  index: number;
  isEdit = false;
  theForm: FormGroup;
  breakpoint: number;
  volume: number;
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
        date: new FormControl(''),
        target: new FormControl(''),
        exercises: new FormArray([]),
      });
    
      if(this.isEdit) {
        this.weekService.getDays(this.weekId).subscribe(item => {
            item = item.sort((a, b) => a.index - b.index);
            this.theForm = new FormGroup({
              id: new FormControl(item[this.index].id ),
              date: new FormControl(item[this.index].date ),
              target: new FormControl(item[this.index].target ),
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
    this.theForm.valueChanges.subscribe(console.log);
    // console.log(this.theForm.value);
    // let array = [];
    // this.theForm.value.exercises.forEach(exercise => {
    //   exercise.sets.forEach(set => {
    //     array.push(set);
    //   });
    // });
    // this.theForm.value.volume = array.map(set => set.rep * set.weight).reduce((currentTotal, item) => {
    //   return item + currentTotal
    // }, 0);
    // this.volume = this.theForm.value.volume;

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
    //   if (this.isEdit) {
      this.weekService.updateDay(this.weekId, this.theForm.value);
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