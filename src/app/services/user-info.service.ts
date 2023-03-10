import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private toastr: ToastrService,
    private router: Router
  ) {}
  uploadImage(selectedImage, postData, formStatus, id) {
    const filePath = `postIMG/${Date.now()}`;

    this.storage.upload(filePath, selectedImage).then(() => {
      console.log('img uploaded succesfully');

      this.storage
        .ref(filePath)
        .getDownloadURL()
        .subscribe((URL) => {
          postData.postImgPath = URL;
          if (formStatus == 'Edit') {
            this.updateData(id, postData);
          } else {
            this.saveData(postData);
          }
        });
    });
  }

  saveData(postData) {
    console.log('saving data');
    this.afs
      .collection('users')
      .doc(JSON.parse(localStorage.getItem('user')).uid)
      .set(postData)
      .then((docRef) => {
        this.toastr.success('Data saved successfully');
        this.router.navigate(['/']);
      });
  }

  updateData(id, postData) {
    this.afs
      .collection('users')
      .doc(id)
      .update(postData)
      .then(() => {
        this.toastr.success('Data updated successfully');
        this.router.navigate(['/']);
      });
  }

  loadOneData(id) {
    return this.afs.collection('users').doc(id).valueChanges();
  }
}
