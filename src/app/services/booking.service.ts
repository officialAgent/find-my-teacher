import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  booking: any;
  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private toastr: ToastrService,
    private router: Router
  ) {}

  loadData() {
    return this.afs
      .collection('bookings', (ref) => {
        let query = ref;

        this.booking = query.where(
          'user2',
          '==',
          JSON.parse(localStorage.getItem('user')).uid
        );
        this.booking +
          query.where(
            'user',
            '==',
            JSON.parse(localStorage.getItem('user')).uid
          );

        return query;
      })
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
  updateData(event) {
    const bookingRef = this.afs.collection('bookings').doc(event.id);
    bookingRef
      .update({ accepted: true })
      .then(() => {
        console.log('Booking update successfully!');
        this.router.navigate(['booking']);
      })
      .catch((error) => {
        console.error('Error jupdating booking: ', error);
      });
  }
  del(id) {
    const callDocRef = this.afs.collection('bookings').doc(id);
    callDocRef
      .delete()
      .then(() => {
        console.log('Document successfully deleted!');
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
  }
  loadOnePost(id) {
    return this.afs.collection('bookings').doc(id).valueChanges();
  }
}
