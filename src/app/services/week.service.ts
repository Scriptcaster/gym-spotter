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
    getDays(weekId) {
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
    updateDay(weekId: any, day: Day, weeklyVolume: number) {
        const document = this.afs.collection('data').doc(this.afAuth.auth.currentUser.uid).collection('weeks').doc(weekId);
        document.collection('days').doc(`${day.id}`).update(day);
        document.update({volume: weeklyVolume});
    }
    getWeeks() {
        return this.weeks;
    }
    addWeek(array) {
        const id = this.afs.createId();
        this.weeksCollection.doc(id).set({ id: id, date:Date.now() / 1000});
        if (array == undefined) {
            this.weeksCollection.doc(id).collection('days').add({ id: '', index: 0, date: 'Monday', target: 'Chest & Triceps', volume: 0 });
            this.weeksCollection.doc(id).collection('days').add({ id: '', index: 1, date: 'Tuesday', target: 'Legs', volume: 0 });
            this.weeksCollection.doc(id).collection('days').add({ id: '', index: 2, date: 'Wednesday', target: 'Day Off', volume: 0 });
            this.weeksCollection.doc(id).collection('days').add({ id: '', index: 3, date: 'Thursday', target: 'Back & Biceps', volume: 0 });
            this.weeksCollection.doc(id).collection('days').add({ id: '', index: 4, date: 'Friday', target: 'Shoulder & Abs', volume: 0 });
            this.weeksCollection.doc(id).collection('days').add({ id: '', index: 5, date: 'Saturday', target: 'Day Off', volume: 0 });
            this.weeksCollection.doc(id).collection('days').add({ id: '', index: 6, date: 'Sunday', target: 'Day Off', volume: 0 });
        } else {
            array.forEach(element => {
                this.weeksCollection.doc(id).collection('days').add(element);
            });
        }
    }
    deleteWeek(id) {
        this.weeksCollection.doc(id).delete();
    }

}

// exercises: [
//     {
//         name: 'Chest Press',
//         sets: [
//             { weight: 60, rep: 8 }
//         ]
//     }
// ]