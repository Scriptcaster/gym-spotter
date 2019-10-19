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
  
  documentForm: FormGroup;
  firstCollection: AngularFirestoreCollection<Day>;
  days: any = [];
  weeks: Week[];
  volumes: any = [];
  dailyVolume: any = [];
  weeklyVolume: any = [];

  constructor(
    public afs: AngularFirestore,
    private weekService: WeekService,
  ) {}
  ngOnInit() {
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
          // days.map(day => {
          //   this.volumes.push(day.volume)
          // });
          // this.dailyVolume = this.volumes.reduce((currentTotal, item) => {
          //   return item + currentTotal
          // }, 0);
          // this.weeklyVolume.push(this.dailyVolume)
        });
      });
    });
  }
  addWeek() {
    this.weekService.addWeek();
    // this.weekService.getWeeks().subscribe(weeks => {
    //   console.log(weeks)
    // });
  }
    
  removeWeek(index) {
    this.weekService.deleteWeek(index);
  }
}