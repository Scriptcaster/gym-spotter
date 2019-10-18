import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';

import { map, switchMap } from 'rxjs/operators';
import { Week } from '../models/week.model';
import { Day } from '../models/day.model';

@Injectable()
export class WeekService {
    weeksCollection: AngularFirestoreCollection<Week>;
    weeks: Observable<Week[]>;
    daysCollection: AngularFirestoreCollection<Day>;
    days: Observable<Day[]>;
    weekDoc: AngularFirestoreDocument<Week>;
    userId: any;
    constructor( 
        public afs: AngularFirestore,
        private afAuth: AngularFireAuth
        ) {
        this.weeks = this.afAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    this.userId = user.uid;
                    this.weeksCollection = this.afs.collection('data').doc(user.uid).collection('weeks'
                    , ref => {
                        return ref
                        // .where('times', '>', 50)
                        .orderBy('date', 'desc')
                        // .limit(2)
                    });

                    return this.weeksCollection.snapshotChanges().pipe(map(changes => {
                        return changes.map(arr => {
                            const data = arr.payload.doc.data() as Week; 
                            data.id = arr.payload.doc.id;
                            return data;
                        });
                    }));
                    // this.weeks.forEach(week => {
                    //     week.forEach(day => {
                    //         this.daysCollection = this.afs.collection('data').doc(user.uid).collection('weeks').doc(day.id).collection('days');       
                    //     })
                    // });
                } else {
                    return of(null);
                }
            })
        );

        // this.days = this.afAuth.authState.pipe(
        //     switchMap(user => {
        //         if (user) {
        //             this.daysCollection = this.afs.collection('data').doc(user.uid).collection('weeks').doc('week0').collection('days');
        //             return this.daysCollection.snapshotChanges().pipe(map(changes => {
        //                 return changes.map(arr => {
        //                     const data = arr.payload.doc.data() as Day;
        //                     data.id = arr.payload.doc.id;
        //                     return data;
        //                 });
        //             }));
        //         } else {
        //             return of(null);
        //         }
        //     })
        // );

    }
    getUserId() {
        return this.userId;
    }
    getWeeks() {
        return this.weeks;
    }
    getDays(weekId) {
        // return this.days;
        return this.afAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    this.daysCollection = this.afs.collection('data').doc(user.uid).collection('weeks').doc(weekId).collection('days');
                    return this.daysCollection.snapshotChanges().pipe(map(changes => {
                        return changes.map(arr => {
                            const data = arr.payload.doc.data() as Day;
                            data.id = arr.payload.doc.id;
                            return data;
                        });
                    }));
                } else {
                    return of(null);
                }
            })
        );
    }
    updateDay(weekId: any, day: Day) {
        this.weeksCollection.doc(weekId).collection('days').doc(`${day.id}`).update(day);
    }
    addWeek() {
        const pushkey = this.afs.createId();
        this.weeksCollection.doc(pushkey).set({ id: pushkey, date:Date.now() / 1000});
        this.weeksCollection.doc(pushkey).collection('days').add({ id: '', index: 0, date: 'Monday', target: 'Chest & Triceps',
            // exercises: [
            //     {
            //         name: 'Chest Press',
            //         sets: [
            //             { weight: 60, rep: 8 }
            //         ]
            //     }
            // ]
        });
        this.weeksCollection.doc(pushkey).collection('days').add({ id: '', index: 1, date: 'Tuesday', target: 'Legs' });
        this.weeksCollection.doc(pushkey).collection('days').add({ id: '', index: 2, date: 'Wednesday', target: 'Day Off' });
        this.weeksCollection.doc(pushkey).collection('days').add({ id: '', index: 3, date: 'Thursday', target: 'Back & Biceps' });
        this.weeksCollection.doc(pushkey).collection('days').add({ id: '', index: 4, date: 'Friday', target: 'Shoulder & Abs' });
        this.weeksCollection.doc(pushkey).collection('days').add({ id: '', index: 5, date: 'Saturday', target: 'Day Off' });
        this.weeksCollection.doc(pushkey).collection('days').add({ id: '', index: 6, date: 'Sunday', target: 'Day Off' });
    }
    deleteWeek(id) {
        console.log('Week ID: ' + id);
        this.weeksCollection.doc(id).delete();
    }

}