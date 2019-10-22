import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { WeekService } from '../../../services/week.service';
import { AngularFirestore } from '@angular/fire/firestore';

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
  volume: any[];
  volumeArray: any[];
  dailyVolume: number;
  weeklyVolume: number;
  bestVolume: number;
  exercises: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private weekService: WeekService,
    public afs: AngularFirestore, 
  ) {}

  ngOnInit() {
    // this.weekService.getBest('ok').subscribe(element => {
    //   console.log(element);
    // });
    // console.log(this.weekService.getBest('ok'));
    this.weekService.getBest().subscribe(element => {
      let array3 = [];
      let nameArray = [];
      this.exercises = element;

      // element.forEach(element => {
      //   this.afs.collection('data').doc('Xi2BQ9KuCwOR2MeHIHUPH5G7bTc2').collection('weeks').doc(element.id).collection('days', ref => {
      //     return ref.orderBy('index', 'asc')
      //   }).snapshotChanges().pipe(map(changes => {
      //     return changes.map(arr => {
      //       const data = arr.payload.doc.data() as Day;
      //       data.id = arr.payload.doc.id;
      //       return data;
      //     });
      //   })).subscribe(days => {
      //     let array = [];
      //     days.map(day => {
      //       day.exercises.map(exercise => {
      //         array.push(exercise);
      //       });
      //     });

      //     let names = array.map(element => { return { 
      //       name: element.name, 
      //       volume: element.volume 
      //     } });
      //     names.forEach(element => { nameArray.push(element) });
      //     console.log(nameArray);
          // console.log(nameArray);
          // let ok = nameArray.filter(element => element.volume >= 1500).map(element => {
          //   return {
          //     name: element.name,
          //     volume: element.volume
          //   }
          // });

          // console.log(ok);
         
          // const uniqueSet = new Set(nameArray);

          // const backToArray = [...uniqueSet];

         

          // console.log(Array.from(new Set(nameArray)));

          // [...new Set(nameArray)];

          // let array2 = names.filter(element => element.name === 'Incline Press').map(element => {
          //  return element.volume;
          // });

          // array3.push(array2[0]);

          // console.log(array3);

          // this.best = Math.max.apply(0, array3);

        // });
      // });

      
      
    });

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
                sets: new FormArray([]),
                volume: new FormControl(exercise.volume),
              })
            );

            for (let set of exercise.sets) {
              const control2 = <FormArray>this.theForm.get('exercises')['controls'][setIndex].get('sets');
              control2.push(
                new FormGroup({
                  weight: new FormControl(set.weight),
                  rep: new FormControl(set.rep),
                  set: new FormControl(set.set), // new
                })
              );
            }
          }
        }

      });
      // this.theForm.valueChanges.subscribe(console.log);
    });

    
    this.theForm.valueChanges.subscribe(() => {
      let array = [];
      this.theForm.value.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          array.push(set);
        });
      });
      this.volume = array.map(set => set.weight * set.rep * set.set);
      this.dailyVolume = this.volume.reduce((currentTotal, item) => {
        return item + currentTotal
      }, 0);
      this.volumeArray[this.index] = this.dailyVolume;
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
      ]),
      volume: new FormControl(''),
    });
  }
  initSets() {
    return new FormGroup({
      weight: new FormControl(''),
      rep: new FormControl(''),
      set: new FormControl(''),
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
    //  let result = result2.filter(o1 => result2.some(o2 => o1.volume > o2.volume));
    
    // if (this.theForm.value != '') {
    // this.theForm.value.exercises;
    this.exercises.sort((a, b) => (a.name > b.name) ? 1 : -1)
    this.theForm.value.exercises.sort((a, b) => (a.name > b.name) ? 1 : -1)
    // console.log(this.exercises);
    // console.log(this.theForm.value.exercises);

    let k = 0;
    this.exercises.forEach(element => {
      if (this.theForm.value.exercises.some(item => item.name === element.name)) {
        element.bestVolume = this.theForm.value.exercises[k].volume;
        k++;
      }
    });
    console.log(this.exercises);
    this.weekService.updateExercises(this.exercises);

    let i = 0;
    this.theForm.value.exercises.forEach(element => {
      element.volume = this.volume[i++];
    });
    this.theForm.value.volume = this.dailyVolume;
    this.weekService.updateDay(this.weekId, this.theForm.value, this.weeklyVolume);
    this.cancelItem();
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