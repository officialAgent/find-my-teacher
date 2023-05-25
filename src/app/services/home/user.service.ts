import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private afs: AngularFirestore,
    private toastr: ToastrService,
    private router: Router
  ) {}
  loadFeatured() {
    return this.afs
      .collection('users', (ref) => ref.where('rating', '>', 4).limit(4))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, data };
          });
        })
      );
  }

  loadLatest() {
    return this.afs
      .collection('users', (ref) => ref.where('role', '==', 'Teacher'))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, data };
          });
        })
      );
  }

  lodaCategoryPosts(categoryId) {
    return this.afs
      .collection('posts', (ref) =>
        ref.where('category.categoryId', '==', categoryId)
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, data };
          });
        })
      );
  }

  loadOnePost(id) {
    return this.afs.collection('users').doc(id).valueChanges();
  }

  loadSimilarPost(categoryId) {
    return this.afs
      .collection('posts', (ref) =>
        ref.where('userId', '==', categoryId).limit(4)
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, data };
          });
        })
      );
  }

  saveData(postData) {
    console.log('saving data');
    this.afs
      .collection('bookings')
      .add(postData)
      .then((docRef) => {
        this.toastr.success('Data saved successfully');
      });
    this.router.navigate(['/userboard']);
  }

  viewsCount(id) {
    const viewsCount = {
      views: firebase.default.firestore.FieldValue.increment(1),
    };
    this.afs
      .collection('users')
      .doc(id)
      .update(viewsCount)
      .then(() => {
        console.log('view updated');
      });
  }
}
