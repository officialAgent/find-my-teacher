import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
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
    this.afs
      .collection('posts')
      .add(postData)
      .then((docRef) => {
        this.toastr.success('Data saved successfully');
        this.router.navigate(['/posts']);
      });
  }

  loadData() {
    return this.afs
      .collection('posts')
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

  loadOneData(id) {
    return this.afs.collection('posts').doc(id).valueChanges();
  }

  updateData(id, postData) {
    this.afs
      .collection('posts')
      .doc(id)
      .update(postData)
      .then(() => {
        this.toastr.success('Data updated successfully');
        this.router.navigate(['/posts']);
      });
  }

  deleteImg(postImgPath, id) {
    this.storage.storage
      .refFromURL(postImgPath)
      .delete()
      .then(() => {
        this.deleteData(id);
      });
  }
  deleteData(id) {
    this.afs
      .collection('posts')
      .doc(id)
      .delete()
      .then(() => {
        this.toastr.success('Data deleted successfully');
      });
  }
  markFeatured(id, featuredData) {
    this.afs
      .collection('posts')
      .doc(id)
      .update(featuredData)
      .then(() => {
        this.toastr.info('Featured updated successfully');
      });
  }
}
