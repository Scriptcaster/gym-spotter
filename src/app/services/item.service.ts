import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';

import { Item } from '../models/item.model';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class ItemService {
    itemsCollection: AngularFirestoreCollection<Item>;
    items: Observable<Item[]>;
    itemDoc: AngularFirestoreDocument<Item>;
 
    constructor( 
        public afs: AngularFirestore,
        private afAuth: AngularFireAuth
        ) {

        this.items = this.afAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    this.itemsCollection = this.afs.collection('data').doc(user.uid).collection('items');
                    // , ref => {
                    //     return ref
                        // .where('times', '>', 50)
                        // .orderBy('target', 'asc')
                        // .limit(2)
                    // });
                    return this.itemsCollection.snapshotChanges().pipe(map(changes => {
                        return changes.map(arr => {
                            const data = arr.payload.doc.data() as Item;
                            data.id = arr.payload.doc.id;
                            return data;
                        });
                    }));
                } else {
                    return of(null);
                }
            })
        );


        // this.afAuth.authState.subscribe(user => {
        //     console.log(this.afAuth.auth.currentUser.uid);
        // });

        // console.log(this.afAuth.auth.currentUser);
        

        // this.items = this.afs.collection('items').doc(this.afAuth.auth.currentUser.uid).collection('exercises').valueChanges();

        // console.log(this.afAuth.auth.currentUser);

        //  this.items = this.afs.collection('items').doc('Xi2BQ9KuCwOR2MeHIHUPH5G7bTc2').collection('exercises')
        //  .snapshotChanges().pipe(map(changes => {
        //        return changes.map(a => {
        //         const data = a.payload.doc.data() as Item;
        //         data.id = a.payload.doc.id;
        //         return data;
        //     });
        // }));

      

    }

    getItems() {
        return this.items;
    }

    addItem(item: Item) {
        this.itemsCollection.add(item);
    }

    updateItem(item: Item) {
        this.itemsCollection.doc(`${item.id}`).update(item);
    }

    deleteItem(item: Item) {
        this.itemsCollection.doc(`${item.id}`).delete();
    }

}