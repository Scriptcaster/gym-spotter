import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

import { WeekService } from '../../services/week.service';
import { Week } from '../../models/week.model';
import { Day } from '../../models/day.model';

@Component({
  selector: 'app-weeks',
  templateUrl: './weeks.component.html',
  styles: []
})
export class WeeksComponent implements OnInit {
  
  firstCollection: AngularFirestoreCollection<Day>;
  weeks: Week[];
  days: any = [];
  documentForm: FormGroup;
  volume: any = [];
  array: any = [];
  total: any = [];

  dataArray: any = [];

  newWeek: any = 'hey';

  count: number;

  constructor(
    public afs: AngularFirestore,
    private weekService: WeekService,
    private afAuth: AngularFireAuth
  ) {}
  ngOnInit() {

    let dayData: any;
    this.weekService.getWeeks().subscribe(weeks => {
      this.weeks = weeks;
      this.weeks.forEach(element => {
        this.afs.collection('data').doc('Xi2BQ9KuCwOR2MeHIHUPH5G7bTc2').collection('weeks').doc(element.id).collection('days', ref => {
          return ref
            .orderBy('index', 'asc')
        }).snapshotChanges().pipe(map(changes => {
          return changes.map(arr => {
            const data = arr.payload.doc.data() as Day;
            data.id = arr.payload.doc.id;
            return data;
          });
        })).subscribe(days => {
          this.days.push(days);
          // this.days.forEach(day => {
          //   day.forEach(item => {
          //     if(item.exercises) {
          //       item.exercises.forEach(exercise => {
          //         exercise.sets.forEach(set => {
          //           this.array.push(set);
          //         });
          //       });
          //     }
          //   });   
          // });
          // this.volume = this.array.map(set => set.rep * set.weight).reduce((currentTotal, item) => {
          //     return item + currentTotal
          //   }, 0);
          // this.total.push(this.volume);
        });
      });
    });
  }
  addWeek() {
    this.weekService.addWeek();
  }
  removeWeek(index) {
    this.weekService.deleteWeek(index);
  }
  // onChange($event, week) {
  //   this.updateWeek(week);
  // }
  // deleteWeek(event, week: Week) {
  //   this.weekService.deleteWeek(week);
  // }
  // updateWeek(week: Week) {
  //   this.weekService.updateWeek(week);
  // }
  // getWeekIndex(index) {
  //   console.log(index);
  // }

}
