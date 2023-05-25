import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { da } from 'date-fns/locale';
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
        this.router.navigate(['userboard']);
      });
  }

  updateData(id, postData) {
    this.afs
      .collection('users')
      .doc(id)
      .update(postData)
      .then(() => {
        this.toastr.success('Data updated successfully');
        this.router.navigate(['userboard']);
      });
  }

  loadOneData(id) {
    return this.afs.collection('users').doc(id).valueChanges();
  }
  loadRole(id) {
    console.log(id);
    return this.afs
      .collection('users')
      .doc(id)
      .get()
      .toPromise()
      .then((doc) => {
        console.log('ccc' + doc);
        if (doc.exists) {
          const data = doc.data() as { role: string };
          const response = data.role;
          console.log('data' + data.role);
          return response;
        } else {
          console.log('No such document!');
          return null;
        }
      })
      .catch((error) => {
        console.log('Error getting document: ', error);
        return null;
      });
  }
}
