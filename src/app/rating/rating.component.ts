import { Component, EventEmitter, Input } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
})
export class RatingComponent {
  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private router: Router
  ) {}
  @Input() rating: number = 0;
  @Input() info: boolean = false;
  @Input() id: any = '';

  onStarClick(star: number) {
    this.rating = star;
    console.log(`Selected rating: ${this.rating}`);

    this.afs
      .collection('users')
      .doc(this.id)
      .get()
      .toPromise()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data() as { rating: number };
          const joined = data.rating;
          let nrating = this.rating;
          if (joined) {
            nrating = Math.round((joined + this.rating) / 2);
            if (nrating > 5) {
              nrating = 5;
            }
          }

          const bookingRef = this.afs.collection('users').doc(this.id);
          console.log(nrating);
          bookingRef
            .update({ rating: nrating })
            .then(() => {
              console.log('Booking joined successfully!');
            })
            .catch((error) => {
              console.error('Error joining booking: ', error);
            });
        } else {
          console.log('No such document!');
        }
      })
      .catch((error) => {
        console.log('Error getting document: ', error);
      });

    this.router.navigate(['/']);
  }
}
